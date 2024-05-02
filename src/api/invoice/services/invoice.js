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
          $and: [{ store: id }, { createdAt: { $gte: start, $lte: end } }],
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
      const temp = Math.ceil(Math.random() * 9);
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
          tips: 5,
          total: 76,
          type: "walkin",
          cardAmount: 76,
          cashAmount: 0,
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
              id: 5,
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
          tips: 4,
          total: 59,
          type: "walkin",
          cardAmount: 0,
          cashAmount: 59,
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
              id: 12,
              name: "Gel X Full Set",
              notes: "",
              price: 70,
              total: 74,
            },
            {
              additional: 0,
              bookingId: 99,
              id: 21,
              name: "Gel Take Off W/O Service",
              notes: "",
              price: 8,
              total: 8,
            },
          ],
          specialist: specialistId,
          store: 1,
          subtotal: 78,
          tips: 8,
          total: 90,
          type: "walkin",
          cardAmount: 45,
          cashAmount: 45,
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
              id: 6,
              name: "Full Set",
              notes: "",
              price: 60,
              total: 64,
            },
            {
              additional: 0,
              bookingId: 99,
              id: 14,
              name: "Gel Color",
              notes: "",
              price: 30,
              total: 30,
            },
          ],
          specialist: specialistId,
          store: 1,
          subtotal: 95,
          tips: 9,
          total: 99,
          type: "appointment",
          cardAmount: 99,
          cashAmount: 0,
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
              id: 7,
              name: "White Tip Full Set",
              notes: "",
              price: 65,
              total: 69,
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
          subtotal: 68,
          tips: 8,
          total: 72,
          type: "appointment",
          cardAmount: 0,
          cashAmount: 72,
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
              id: 9,
              name: "Regular Fill-in",
              notes: "",
              price: 50,
              total: 54,
            },
            {
              additional: 0,
              bookingId: 99,
              id: 20,
              name: "Gel Take Off W/ Service",
              notes: "",
              price: 8,
              total: 8,
            },
          ],
          specialist: specialistId,
          store: 1,
          subtotal: 58,
          tips: 8,
          total: 62,
          type: "walkin",
          cardAmount: 62,
          cashAmount: 0,
        },
        {
          additional: 0,
          appointment: appointId,
          client: clientId,
          createdby: "admin",
          services: [
            {
              additional: 0,
              bookingId: 99,
              id: 12,
              name: "Gel X Full Set",
              notes: "",
              price: 70,
              total: 70,
            },
          ],
          specialist: specialistId,
          store: 1,
          subtotal: 70,
          tips: 8,
          total: 70,
          type: "appointment",
          cardAmount: 35,
          cashAmount: 35,
        },
        {
          additional: 0,
          appointment: appointId,
          client: clientId,
          createdby: "admin",
          services: [
            {
              additional: 0,
              bookingId: 99,
              id: 7,
              name: "White Tip Full Set",
              notes: "",
              price: 65,
              total: 65,
            },
          ],
          specialist: specialistId,
          store: 1,
          subtotal: 65,
          tips: 8,
          total: 65,
          type: "appointment",
          cardAmount: 0,
          cashAmount: 59,
        },
        {
          additional: 0,
          appointment: appointId,
          client: clientId,
          createdby: "admin",
          services: [
            {
              additional: 0,
              bookingId: 99,
              id: 4,
              name: "London Pedicure",
              notes: "",
              price: 30,
              total: 30,
            },
          ],
          specialist: specialistId,
          store: 1,
          subtotal: 30,
          tips: 8,
          total: 30,
          type: "appointment",
          cardAmount: 0,
          cashAmount: 30,
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
