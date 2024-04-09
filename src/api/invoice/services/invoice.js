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
          payroll: {
            select: ["id"],
          },
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
  test: async (ctx) => {
    const { clientId, specialistId, appointId } = ctx.params;
    try {
      console.log("test", clientId, specialistId, appointId);
      const data = {
        additional: 6,
        appointment: appointId,
        client: clientId,
        createdby: "admin",
        services: [
          {
            additional: true,
            bookingId: 99,
            id: 1,
            name: "Gel Manicure",
            notes: "",
            price: 40,
            total: 44,
          },
          {
            additional: 0,
            bookingId: 99,
            id: 2,
            name: "Gel removal",
            notes: "",
            price: 3,
            total: undefined,
          },
          {
            additional: true,
            bookingId: 99,
            id: 3,
            name: "London Manicure",
            notes: "",
            price: 22,
            total: 24,
          },
        ],
        specialist: specialistId,
        store: 1,
        subtotal: 65,
        total: 71,
        type: "walkin",
        testCreatedAt: new Date(),
      };
      const entry = await strapi.entityService.create("api::invoice.invoice", {
        data,
      });

      return entry;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
}));
