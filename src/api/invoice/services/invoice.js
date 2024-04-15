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
            populate: {
              signature: true,
            },
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
      const temp = Math.ceil(Math.random() * 4);
      console.log("temp", temp);
      console.log("test", clientId, specialistId, appointId);
      const data = [
        {
          additional: 6,
          appointment: appointId,
          client: clientId,
          createdby: "admin",
          services: [
            {
              additional: 4,
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
              total: 3,
            },
            {
              additional: 2,
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
        },
        {
          additional: 4,
          appointment: appointId,
          client: clientId,
          createdby: "admin",
          services: [
            {
              additional: 4,
              bookingId: 99,
              id: 1,
              name: "London Combo",
              notes: "",
              price: 48,
              total: 52,
            },
            {
              additional: 0,
              bookingId: 99,
              id: 2,
              name: "Gel removal",
              notes: "",
              price: 3,
              total: 3,
            },
          ],
          specialist: specialistId,
          store: 1,
          subtotal: 51,
          total: 55,
          type: "appointment",
          testCreatedAt: new Date(),
        },
        {
          additional: 4,
          appointment: appointId,
          client: clientId,
          createdby: "admin",
          services: [
            {
              additional: 4,
              bookingId: 99,
              id: 1,
              name: "Gel X Full Set",
              notes: "",
              price: 70,
              total: 74,
            },
            {
              additional: 0,
              bookingId: 99,
              id: 2,
              name: "Gel Take Off W/ Service",
              notes: "",
              price: 8,
              total: 8,
            },
          ],
          specialist: specialistId,
          store: 1,
          subtotal: 78,
          total: 82,
          type: "appointment",
          testCreatedAt: new Date(),
        },
        {
          additional: 4,
          appointment: appointId,
          client: clientId,
          createdby: "admin",
          services: [
            {
              additional: 4,
              bookingId: 99,
              id: 1,
              name: "Full Set",
              notes: "",
              price: 65,
              total: 69,
            },
            {
              additional: 0,
              bookingId: 99,
              id: 2,
              name: "Gel Color",
              notes: "",
              price: 30,
              total: 30,
            },
          ],
          specialist: specialistId,
          store: 1,
          subtotal: 95,
          total: 99,
          type: "appointment",
          testCreatedAt: new Date(),
        },
      ];

      const entry = await strapi.entityService.create("api::invoice.invoice", {
        data: data[temp - 1],
      });

      return entry;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
}));
