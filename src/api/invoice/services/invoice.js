"use strict";

/**
 * invoice service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::invoice.invoice", ({ strapi }) => ({
  payroll: async (ctx) => {
    const { id, start, end } = ctx.params;

    try {
      const data = await strapi.entityService.findMany("api::invoice.invoice", {
        filters: {
          $and: [{ store: id }, { testCreatedAt: { $gte: start, $lte: end } }],
        },
        populate: {
          specialist: true,
        },
      });
      const model = {};
      data.reduce((acc, item) => {
        const { specialist } = item;
        const specialistId = specialist.id;
        if (!acc[specialistId]) {
          acc[specialistId] = [];
        }
        acc[specialistId].push(item);
        return acc;
      }, model);

      return model;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
}));
