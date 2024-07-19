"use strict";

/**
 * register controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::register.register",
  ({ strapi }) => ({
    getRegister: async (ctx, next) => {
      try {
        const data = await strapi
          // @ts-ignore
          .service("api::register.register")
          .getRegister(ctx);
        ctx.send(
          {
            data,
          },
          200
        );
      } catch (error) {}
    },
  })
);
