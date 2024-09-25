"use strict";

/**
 * register controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const { errors } = require("@strapi/utils");
const { UnauthorizedError } = errors;
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
        const data = await strapi
          // @ts-ignore
          .service("api::register.register")
          .test(ctx);
        ctx.send(
          {
            data,
          },
          200
        );
      } catch (error) {
        console.log("error", error);
        ///throw new UnauthorizedError("Invalid token");
        ctx.throw(error);
      }
    },
    test1: async (ctx, next) => {
      try {
        const { name } = ctx.request.body.data;
        const token = ctx.request.header.authorization; //valid-token
        console.log("token", token);
        console.log("name", name);
        if (token !== "valid-token") {
          const error = {
            message: "Invalid token1",
            status: 401,
          };
          throw error;
        }
        ctx.send(
          {
            name,
          },
          200
        );
      } catch (error) {
        console.log("error", error);
        throw new UnauthorizedError("Invalid token");
      }
    },
  })
);
