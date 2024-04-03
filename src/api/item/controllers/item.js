"use strict";

/**
 * item controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::item.item", ({ strapi }) => ({
  bulk: async (ctx, next) => {
    try {
      const data = await strapi.service("api::item.item").bulk(ctx);
      ctx.send(
        {
          data,
        },
        200
      );
    } catch (error) {}
  },
}));
