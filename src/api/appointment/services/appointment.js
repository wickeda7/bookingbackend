"use strict";

/**
 * appointment service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::appointment.appointment",
  ({ strapi }) => ({
    specialists: async (ctx, next) => {
      const { id } = ctx.params;
      const ids = id.split("_");
      try {
        const data = await strapi.entityService.findMany(
          "plugin::users-permissions.user",
          {
            filters: {
              id: {
                $in: ids,
              },
            },
            fields: ["id"],
            populate: {
              appointmentsSpecialist: {
                filters: {
                  done: {
                    $eq: false,
                  },
                },
              },
            },
          }
        );
        return data;
      } catch (error) {}
    },

    putBooking: async (ctx, next) => {
      const { id } = ctx.params;
      const { service, type, staff } = ctx.request.body.data;

      let numSpecialistArr = [];
      const specialistId = service.specialist.id;
      const entry = await strapi.entityService.findOne(
        "api::appointment.appointment",
        id,
        {
          populate: {
            specialists: {
              fields: ["id"],
              populate: {
                userInfo: true,
              },
            },
            client: {
              fields: ["id"],
              populate: {
                userInfo: true,
              },
            },
          },
        }
      );
      if (entry) {
        const {
          id: bookingId,
          confirmed,
          services,
          timeslot,
          date,
          userID,
          storeID,
          specialistID,
          specialists,
          callBack,
          client,
        } = entry;
        let newServ = [];
        let updateData = {};
        let servicesP = [];
        servicesP =
          typeof services === "string" ? JSON.parse(services) : services;

        if (type === "remove") {
          const id = service.id;
          let removedItem = {};
          newServ = servicesP.map((item) => {
            if (item.id === id) {
              removedItem = {
                ...item,
                specialist: null,
                status: "pending",
                specialistID: null,
              };
              return removedItem;
            } else {
              return item;
            }
          });

          numSpecialistArr = newServ.filter(
            (obj) => obj.specialistID === specialistId
          );
          const numSpecialist = newServ.filter(
            (obj) => obj.specialist !== null
          );

          if (numSpecialist.length === 0) {
            updateData = {
              services: JSON.stringify(newServ),
              specialists: null,
              specialistID: null,
            };
          } else if (numSpecialistArr.length === 0) {
            updateData = {
              services: JSON.stringify(newServ),
              specialists: numSpecialist[0].specialist,
              specialistID: numSpecialist[0].specialist.id,
            };
          } else {
            updateData = {
              services: JSON.stringify(newServ),
            };
          }
        } else {
          newServ = servicesP.reduce((acc, item) => {
            const {
              id,
              name,
              price,
              description,
              priceOption,
              specialist,
              status,
            } = item;
            const newStatus = !specialist ? "working" : status;
            const newSpecialist = !specialist ? staff : specialist;

            return [
              ...acc,
              {
                id,
                name,
                price,
                description,
                priceOption,
                specialist: newSpecialist,
                status: newStatus,
                callBack: callBack,
                client: client,
                storeID: storeID,
                date: date,
                bookingId: bookingId,
                specialistID: newSpecialist.id,
                timeslot: timeslot,
                userID: userID,
              },
            ];
          }, []);
          updateData = {
            services: JSON.stringify(newServ),
            specialists: staff.id,
            specialistID: staff.id,
          };
        }
        try {
          let data = await strapi.entityService.update(
            "api::appointment.appointment",
            id,
            {
              data: updateData,
              populate: {
                specialists: {
                  fields: ["id"],
                  populate: {
                    userInfo: true,
                  },
                },
                client: {
                  fields: ["id"],
                  populate: {
                    userInfo: true,
                  },
                },
              },
            }
          );
          const pushToken = service.specialist.userInfo.pushToken;

          data["type"] = type;
          if (numSpecialistArr.length === 0 && type === "remove") {
            data["removeId"] = specialistId;
          }
          if (pushToken) {
            console.log("pushToken", pushToken);
            const clientMessage = `There is an update on your booking.`;
            strapi.services["api::appointment.notification"].handlePushTokens(
              pushToken,
              {
                subject: "Booking Update",
                message: clientMessage,
                result: data,
              }
            );
          }
          return data;
        } catch (error) {}
      }
    },
    notify: async (ctx, next) => {
      const { data } = ctx.request.body;
      const { storeID } = data[0];

      console.log("item", storeID);
      try {
        const entry = await strapi.entityService.findOne(
          "api::store.store",
          storeID,
          {
            fields: ["id", "name"],
            populate: {
              admin: {
                fields: ["id", "email"],
                populate: {
                  userInfo: {
                    fields: ["id", "socketId"],
                  },
                },
              },
            },
          }
        );
        if (!entry) throw new Error("No store found");
        const { admin } = entry;
        const socketArr = admin.reduce((acc, item) => {
          if (item.userInfo.socketId !== null) {
            return [...acc, item.userInfo.socketId];
          }
          return acc;
        }, []);
        if (socketArr.length > 0) {
          socketArr.forEach((item) => {
            // @ts-ignore
            strapi.ioServer.to(item).emit("bookingChanged", data);
          });
        }
        return { success: true };
      } catch (error) {}
    },
    message: async (ctx, next) => {
      const {
        subject,
        message,
        pushToken,
        phone,
        client,
        specialist,
        date,
        timeslot,
        bookingId,
        storeID,
        sendText,
      } = ctx.request.body.data;

      try {
        if (timeslot) {
          //confirmation for appointment
          const { hours } = specialist.hours.find(
            (item) => +item.id === timeslot
          );
          const data = await strapi.db.query("api::store.store").findOne({
            select: ["name"],
            where: { id: storeID },
          });

          const specialistName =
            specialist.firstName + " " + specialist.lastName;
          const specialistPhone = specialist.phoneNumber;
          const specialistPushToken = specialist.pushToken;
          const clientName = client.firstName + " " + client.lastName;
          const clientPhone = client.phoneNumber;
          const clientPushToken = client.pushToken;
          const storeName = data.name;
          const time = hours.split("-")[0];

          const entry = await strapi.entityService.update(
            "api::appointment.appointment",
            bookingId,
            {
              data: {
                confirmed: true,
              },
            }
          );
          if (entry) {
            //send notification to specialist
            const specialistMessage = `You have a new appointment with ${clientName}  on ${date} at ${time} has been confirmed.`;
            strapi.services["api::appointment.notification"].handlePushTokens(
              specialistPushToken,
              { subject, specialistMessage }
            );
            if (specialistPhone && sendText) {
              strapi.services["api::appointment.sms"].sendSms(
                "1" + specialistPhone,
                specialistMessage
              );
            }
            const clientMessage = `Your appointment with ${specialistName} at ${storeName} on ${date} at ${time} has been confirmed.`;
            strapi.services["api::appointment.notification"].handlePushTokens(
              clientPushToken,
              { subject, clientMessage }
            );
            if (clientPhone && sendText) {
              strapi.services["api::appointment.sms"].sendSms(
                "1" + clientPhone,
                clientMessage
              );
            }
          }
        } else {
          //notification for call back
          strapi.services["api::appointment.notification"].handlePushTokens(
            pushToken,
            { subject, message }
          );
          if (phone) {
            strapi.services["api::appointment.sms"].sendSms(
              "1" + phone,
              message
            );
          }
        }

        return { success: true };
      } catch (error) {}
    },
    cancel: async (ctx, next) => {
      const { id } = ctx.params;
      try {
        const data = await strapi.entityService.update(
          "api::appointment.appointment",
          id,
          {
            data: {
              canceled: true,
            },
          }
        );
        return data;
      } catch (error) {
        console.log("error", error);
      }
    },
    user: async (ctx, next) => {
      const { id, done, type } = ctx.params;
      let field = "";
      if (type === "specialist") {
        field = "specialistID";
      } else if (type === "store") {
        field = "storeID";
      } else {
        field = "userID";
      }
      try {
        const data = await strapi.entityService.findMany(
          "api::appointment.appointment",
          {
            filters: {
              [field]: {
                $eq: id,
              },
              canceled: {
                $eq: false,
              },
              done: {
                $eq: done,
              },
            },
            sort: "createdAt:desc",
            populate: {
              client: {
                fields: ["id", "email"],
                populate: {
                  userInfo: {
                    fields: [
                      "hours",
                      "specialty",
                      "firstName",
                      "lastName",
                      "phoneNumber",
                      "pushToken",
                      "socketId",
                    ],
                    populate: {
                      profileImg: {
                        fields: ["url"],
                      },
                    },
                  },
                },
              },
              specialists: {
                fields: ["id", "email"],
                populate: {
                  userInfo: {
                    fields: [
                      "hours",
                      "specialty",
                      "firstName",
                      "lastName",
                      "phoneNumber",
                      "pushToken",
                      "socketId",
                    ],
                  },
                },
              },
              store: {
                fields: [
                  "id",
                  "name",
                  "address",
                  "city",
                  "state",
                  "zip",
                  "phone",
                  "coordinate",
                  "timeslot",
                ],
                populate: {
                  logo: {
                    fields: ["url"],
                  },
                },
              },
            },
          }
        );
        return data;
      } catch (error) {}
    },
  })
);
