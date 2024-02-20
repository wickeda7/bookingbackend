"use strict";

/**
 * store controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::store.store", ({ strapi }) => ({
  populate: async (ctx, next) => {
    // const { id } = ctx.params;
    try {
      const data = await strapi.service("api::store.store").populate(ctx);
      ctx.send(
        {
          data,
        },
        200
      );
    } catch (error) {}
  },
  getStores: async (ctx, next) => {
    try {
      const data = await strapi.service("api::store.store").getStores(ctx);
      ctx.send(
        {
          data,
        },
        200
      );
    } catch (error) {}
  },
}));
