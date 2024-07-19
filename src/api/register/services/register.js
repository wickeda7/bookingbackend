"use strict";

const { filter, sort } = require("../../../../config/middlewares");

/**
 * register service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::register.register", ({ strapi }) => ({
  getRegister: async (ctx) => {
    const { name, email, phone, storeId } = ctx.query;
    let user = null;
    // console.log("getRegister", ctx.query);
    // return;
    try {
      const data = await strapi.entityService.findMany(
        "api::register.register",
        {
          filters: {
            $or: [
              {
                name,
              },
              {
                email,
              },
              {
                phone,
              },
            ],
            $and: [
              {
                storeId,
              },
            ],
          },
        }
      );
      if (data.length > 0) {
        user = data[0];
        const appointments = await strapi.entityService.findMany(
          "api::appointment.appointment",
          {
            filters: { register: user.id },
            sort: { createdAt: "desc" },
            limit: 10,
          }
        );
        if (appointments.length > 0) {
          const services = appointments.map((a) => {
            const { services, updatedAt } = a;
            return { services, updatedAt };
          });
          user.prevServices = services;
        }
      }
      return user;
    } catch (error) {
      console.log(error);
    }
  },
}));
