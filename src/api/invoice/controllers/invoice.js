"use strict";

/**
 * invoice controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::invoice.invoice", ({ strapi }) => ({
  payroll: async (ctx, next) => {
    // const { id } = ctx.params;
    try {
      const data = await strapi.service("api::invoice.invoice").payroll(ctx);
      ctx.send(
        {
          data,
        },
        200
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  test: async (ctx, next) => {
    // const { id } = ctx.params;
    try {
      const data = await strapi.service("api::invoice.invoice").test(ctx);
      ctx.send(
        {
          data,
        },
        200
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
}));
