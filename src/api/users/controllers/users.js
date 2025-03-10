"use strict";

/**
 * A set of functions called "actions" for `users`
 */

module.exports = {
  getUser: async (ctx, next) => {
    try {
      const data = await strapi.service("api::users.users").getUser(ctx, next);
      if (data.error) {
        throw new Error(data.error);
      }
      ctx.send(
        {
          data,
        },
        200
      );
    } catch (err) {
      ctx.badRequest(err.message);
    }
  },
  async registerUser(ctx, next) {
    try {
      const data = await strapi.service("api::users.users").registerUser(ctx);
      ctx.send(
        {
          data,
        },
        200
      );
    } catch (err) {
      ctx.badRequest(err);
    }
  },
  //   async cloverLogin(ctx, next) {
  //     try {
  //       const data = await strapi.service("api::users.users").cloverLogin(ctx);
  //       // console.log("test message");
  //       // // @ts-ignore
  //       // strapi.ioServer.emit("test", "test message");
  //       ctx.send(
  //         {
  //           data,
  //         },
  //         200
  //       );
  //     } catch (err) {
  //       ctx.badRequest(err);
  //     }
  //   },
  async updateUser(ctx, next) {
    try {
      const data = await strapi.service("api::users.users").updateUser(ctx);
      ctx.send(
        {
          data,
        },
        200
      );
    } catch (err) {
      ctx.badRequest(err);
    }
  },
};
