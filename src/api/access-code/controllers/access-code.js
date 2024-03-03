"use strict";

/**
 * access-code controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
module.exports = createCoreController(
  "api::access-code.access-code",
  ({ strapi }) => ({
    deleteCode: async (ctx, next) => {
      try {
        const data = await strapi
          .service("api::access-code.access-code")
          .deleteCode(ctx);
        ctx.send(
          {
            data,
          },
          200
        );
      } catch (error) {}
    },
    getCode: async (ctx, next) => {
      try {
        const data = await strapi
          .service("api::access-code.access-code")
          .getCode(ctx);
        ctx.send(
          {
            data,
          },
          200
        );
      } catch (error) {}
    },
    sendCode: async (ctx, next) => {
      try {
        const data = await strapi
          .service("api::access-code.access-code")
          .sendCode(ctx);
        console.log("data", data);
        ctx.send(
          {
            data,
          },
          200
        );
      } catch (error) {
        console.log("Could not send SMS", error.code, error.message);
        ctx.badRequest("Could not send SMS", { moreDetails: error.message });
      }
    },
  })
);
