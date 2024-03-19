"use strict";

/**
 * access-code service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::access-code.access-code",
  ({ strapi }) => ({
    deleteCode: async (ctx, next) => {
      const { data } = ctx.request.body;
      try {
        const res = await strapi.db
          .query("api::access-code.access-code")
          .deleteMany({
            where: {
              id: {
                $in: data,
              },
            },
          });
        return res;
      } catch (error) {
        throw new Error(error);
      }
    },
    sendCode: async (ctx, next) => {
      const { phoneNumber, code, firstName, lastName } = ctx.request.body.data;
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioNum = process.env.TWILIONUM;
      const client = require("twilio")(accountSid, authToken);

      return client.messages
        .create({
          body: `Hello ${firstName} ${lastName}, Please use this code to add to our staff system: ${code} go to BookingApp: ${process.env.APP_URL}`,
          from: twilioNum, //the phone number provided by Twillio
          to: phoneNumber, // your own phone number
        })
        .then((message) => {
          return message.sid;
        })
        .catch(function (error) {
          throw error;
        })
        .finally();
    },
    getCode: async (ctx, next) => {
      const { id, code } = ctx.params;
      try {
        const res = await strapi.db
          .query("api::access-code.access-code")
          .findOne({
            where: {
              code: code,
            },
          });
        if (res) {
          const codeId = res.id;
          const storeId = res.code.split("_")[0];
          const entry = await strapi.db
            .query("plugin::users-permissions.user")
            .update({
              select: ["email"],
              populate: {
                role: {
                  select: ["name", "id"],
                },
                storeEmployee: {
                  select: ["id", "name"],
                },
                userInfo: {
                  select: [
                    "firstName",
                    "lastName",
                    "phoneNumber",
                    "firebase",
                    "pushToken",
                    "socketId",
                  ],
                  populate: {
                    profileImg: {
                      select: ["url"],
                    },
                  },
                },
                favorites: {
                  populate: {
                    logo: {
                      select: ["url"],
                    },
                  },
                },
              },
              where: { id: id },
              data: {
                role: 3,
                storeEmployee: storeId,
              },
            });
          const del = await strapi.db
            .query("api::access-code.access-code")
            .delete({
              where: { id: codeId },
            });
          return entry;
        }
        return false;
      } catch (error) {
        console.log("error", error);
        throw new Error(error);
      }
    },
  })
);
