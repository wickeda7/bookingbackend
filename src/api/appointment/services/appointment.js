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
                    ],
                    populate: {
                      profileImg: {
                        fields: ["url"],
                      },
                    },
                  },
                },
              },
              specialist: {
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
