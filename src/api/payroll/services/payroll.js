"use strict";

/**
 * payroll service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::payroll.payroll", ({ strapi }) => ({
  message: async (ctx) => {
    const { payrollId, userId, storeId } = ctx.request.body.data;
    console.log("message", ctx.request.body.data);
    try {
      const entry = await strapi.entityService.findOne(
        "api::store.store",
        storeId,
        {
          fields: ["id", "name"],
          populate: {
            admin: {
              fields: ["id", "email"],
              populate: {
                userInfo: {
                  fields: ["pushToken", "socketId"],
                },
              },
            },
          },
        }
      );
      if (!entry) throw new Error("No store found");
      const storeTokens = entry.admin.reduce((acc, curr) => {
        if (curr.userInfo.pushToken) {
          acc.push(curr.userInfo.pushToken);
        }
        return acc;
      }, []);
      const messageData = {
        title: `New Confirmation`,
        message: ``,
        data: { payrollId, userId, storeId, type: "PayrollConfirmation" },
      };
      strapi.services["api::payroll.notification"].handlePushTokens(
        storeTokens,
        messageData
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
}));
