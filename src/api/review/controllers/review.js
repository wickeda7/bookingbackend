"use strict";

/**
 * review controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::review.review", ({ strapi }) => ({
  store: async (ctx, next) => {
    // const { id } = ctx.params;
    try {
      const data = await strapi
        .service("api::review.review")
        .populateStore(ctx);
      ctx.send(
        {
          data,
        },
        200
      );
    } catch (error) {}
  },
  specialist: async (ctx, next) => {
    // const { id } = ctx.params;
    try {
      const data = await strapi
        .service("api::review.review")
        .populateSpecialist(ctx);
      ctx.send(
        {
          data,
        },
        200
      );
    } catch (error) {}
  },
}));
