"use strict";

const { register } = require("../../..");

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
              appointmentsSpecialists: {
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
      // console.log("service", service);
      // console.log("type", type);
      // console.log("staff", staff);
      // console.log("ctx.request.body.data", ctx.request.body.data);
      // return;
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
            register: true,
          },
        }
      );
      if (entry) {
        const {
          id: bookingId,
          services,
          timeslot,
          date,
          userID,
          storeID,
          callBack,
          client,
          specialists,
          register,
        } = entry;
        let newServ = [];
        let updateData = {};
        let servicesP = [];
        let removeId = null;
        const specialistIdArr = specialists.reduce((acc, item) => {
          acc.push(item.id);
          return acc;
        }, []);
        servicesP =
          typeof services === "string" ? JSON.parse(services) : services;

        if (type === "remove") {
          const id = service.id;
          newServ = servicesP.map((item) => {
            let removedItem = {};
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
        } else if (type === "splitService") {
          const serviceId = +service.id / 10;
          servicesP = servicesP.map((item) => {
            if (item.id === serviceId) {
              const ogPrice = item.price * 100;
              const splitPrice = service.price * 100;
              return {
                ...item,
                price: (ogPrice - splitPrice) / 100,
              };
            } else {
              return item;
            }
          });
          newServ = [...servicesP, service];
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
            const newClient = !client ? register : client;
            const isRegistered = !client ? true : false;
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
                client: newClient,
                storeID: storeID,
                date: date,
                bookingId: bookingId,
                specialistID: newSpecialist.id,
                timeslot: timeslot,
                userID: userID,
                isRegistered,
              },
            ];
          }, []);
        }
        const newServArr = newServ.reduce((acc, item) => {
          if (item.specialist) {
            if (!acc.includes(item.specialist.id)) {
              acc.push(item.specialist.id);
            }
          }
          return acc;
        }, []);
        const diff = specialistIdArr.filter((d) => !newServArr.includes(d));

        if (type === "remove") {
          if (diff.length > 0) {
            removeId = diff[0];
          }
        }
        updateData = {
          services: JSON.stringify(newServ),
          specialists: newServArr,
          specialistID: newServArr[0] ? newServArr[0] : null,
        };

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
                register: true,
              },
            }
          );
          if (type !== "splitService") {
            const pushToken = service.specialist.userInfo.pushToken;
            const tokenData = {};
            tokenData["type"] = type;
            if (removeId) {
              tokenData["removeId"] = removeId;
              data["removeId"] = removeId;
            }
            if (pushToken) {
              tokenData["bookingId"] = id;
              const clientMessage = `There is an update on your booking.`;
              strapi.services["api::appointment.notification"].handlePushTokens(
                pushToken,
                {
                  title: "Booking Update",
                  message: clientMessage,
                  data: tokenData,
                }
              );
            }
          }
          return data;
        } catch (error) {}
      }
    },
    notify: async (ctx, next) => {
      const { data } = ctx.request.body;
      const { storeID } = data;
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
      const { subject, message, pushToken, phone, sendText, bookingId } =
        ctx.request.body.data;
      try {
        if (bookingId) {
          //confirmation for appointment
          const entry = await strapi.entityService.update(
            "api::appointment.appointment",
            bookingId,
            {
              data: {
                confirmed: true,
              },
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
                store: {
                  fields: ["name"],
                },
              },
            }
          );
          if (!entry) throw new Error("No booking found");
          const { date, timeslot, client, specialists, store } = entry;
          const clientInfo = client.userInfo;
          const specialistInfo = specialists[0].userInfo;
          const { hours } = specialistInfo.hours.find(
            (item) => +item.id === timeslot
          );
          const specialistName =
            specialistInfo.firstName + " " + specialistInfo.lastName;
          const specialistPhone = specialistInfo.phoneNumber;
          const specialistPushToken = specialistInfo.pushToken;
          const clientName = clientInfo.firstName + " " + clientInfo.lastName;
          const clientPhone = clientInfo.phoneNumber;
          const clientPushToken = clientInfo.pushToken;
          const storeName = store.name;
          const time = hours.split("-")[0];
          const dateArr = date.split("-");
          const specialistMessage = `You have a new appointment with ${clientName}  on ${dateArr[1]}-${dateArr[2]}-${dateArr[0]} at ${time} has been confirmed.`;

          if (specialistPushToken) {
            strapi.services["api::appointment.notification"].handlePushTokens(
              specialistPushToken,
              {
                title: subject,
                message: specialistMessage,
                data: { bookingId, type: "confirmed" },
              }
            );
          }

          if (specialistPhone && sendText) {
            strapi.services["api::appointment.sms"].sendSms(
              "1" + specialistPhone,
              specialistMessage
            );
          }

          const clientMessage = `Your appointment with ${specialistName} at ${storeName} on ${date} at ${time} has been confirmed.`;
          if (clientPushToken) {
            strapi.services["api::appointment.notification"].handlePushTokens(
              clientPushToken,
              {
                title: subject,
                message: clientMessage,
                data: { bookingId, type: "confirmed" },
              }
            );
          }

          if (clientPhone && sendText) {
            strapi.services["api::appointment.sms"].sendSms(
              "1" + clientPhone,
              clientMessage
            );
          }
        } else {
          //notification for call back
          strapi.services["api::appointment.notification"].handlePushTokens(
            pushToken,
            { title: subject, message }
          );
          if (phone) {
            strapi.services["api::appointment.sms"].sendSms(
              "1" + phone,
              message
            );
          }
        }

        return { success: true };
      } catch (error) {
        console.log("error", error);
      }
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
            populate: {
              specialists: {
                fields: ["id"],
                populate: {
                  userInfo: {
                    fields: ["pushToken", "socketId"],
                  },
                },
              },
              store: {
                fields: ["id"],
                populate: {
                  admin: {
                    fields: ["id"],
                    populate: {
                      userInfo: {
                        fields: ["pushToken", "socketId"],
                      },
                    },
                  },
                },
              },
            },
          }
        );
        const timeslot = data.timeslot;
        const bookingId = data.id;
        let messageData = {
          title: "Booking Canceled",
          message: `Your booking has been canceled`,
          data: { bookingId, timeslot, type: "cancel" },
        };
        const specialistTokens = data.specialists.reduce((acc, curr) => {
          if (curr.userInfo.pushToken) {
            acc.push(curr.userInfo.pushToken);
          }
          return acc;
        }, []);
        const storeTokens = data.store.admin.reduce((acc, curr) => {
          if (curr.userInfo.pushToken) {
            acc.push(curr.userInfo.pushToken);
          }
          return acc;
        }, []);
        if (specialistTokens.length > 0) {
          strapi.services["api::appointment.notification"].handlePushTokens(
            specialistTokens,
            messageData
          );
        }
        if (storeTokens.length > 0) {
          strapi.services["api::appointment.notification"].handlePushTokens(
            storeTokens,
            messageData
          );
        }

        return data;
      } catch (error) {
        console.log("error", error);
      }
    },
    user: async (ctx, next) => {
      const { id, done, type } = ctx.params;
      let filters = {};
      let filterSpecialist = {};

      if (type === "specialist") {
        filterSpecialist = { id: { $eq: id } };
      } else {
        filterSpecialist = {};
      }

      if (type === "store") {
        filters = { storeID: { $eq: id } };
      } else if (type === "user") {
        filters = { userID: { $eq: id } };
      } else {
        filters = {};
      }

      try {
        const data = await strapi.entityService.findMany(
          "api::appointment.appointment",
          {
            filters: {
              ...filters,
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
                filters: {
                  ...filterSpecialist,
                },
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
                      "totalDeduct",
                      "tipDeduct",
                      "perDay",
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
