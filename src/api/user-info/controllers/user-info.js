"use strict";

/**
 * user-info controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::user-info.user-info",
  ({ strapi }) => ({
    deleteStaff: async (ctx, next) => {
      // const { id } = ctx.params;
      // console.log("ctx.request.body", ctx.request.body);
      try {
        const data = await strapi
          .service("api::user-info.user-info")
          .deleteStaff(ctx);
        console.log("data", data);
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
