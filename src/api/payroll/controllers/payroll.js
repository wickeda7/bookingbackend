"use strict";

/**
 * payroll controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::payroll.payroll", ({ strapi }) => ({
  message: async (ctx, next) => {
    // const { id } = ctx.params;
    try {
      const data = await strapi.service("api::payroll.payroll").message(ctx);
      ctx.send(
        {
          data,
        },
        200
      );
    } catch (error) {}
  },
}));
