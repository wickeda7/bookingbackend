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
    test: async (ctx, next) => {
      try {
        const { name } = ctx.request.body.data;
        const token = ctx.request.header.authorization; //valid-token
        console.log("token", token);
        console.log("name", name);
        if (token !== "valid-token") {
          return ctx.unauthorized("Invalid token");
        }
        ctx.send(
          {
            name,
          },
          200
        );
      } catch (error) {
        console.log("error", error);
      }
    },
  })
);
