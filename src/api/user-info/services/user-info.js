"use strict";

/**
 * user-info service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::user-info.user-info",
  ({ strapi }) => ({
    deleteStaff: async (ctx, next) => {
      const { data } = ctx.request.body;
      try {
        const res = await strapi.db
          .query("api::user-info.user-info")
          .deleteMany({
            where: {
              id: {
                $in: data,
              },
            },
          });
        console.log("res", res.count);
        return res;
      } catch (error) {
        throw new Error(error);
      }
    },
  })
);
