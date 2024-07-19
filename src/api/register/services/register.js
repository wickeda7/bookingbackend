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
    console.log("getRegister", ctx.query);
    // console.log("getRegister", ctx.query);
    // return;
    const orfilters = [];
    if (name) {
      orfilters.push({ name });
    }
    if (email) {
      orfilters.push({ email });
    }
    if (phone) {
      orfilters.push({ phone });
    }
    try {
      if (orfilters.length === 0) {
        throw new Error("No filters provided");
      }
      const data = await strapi.entityService.findMany(
        "api::register.register",
        {
          filters: {
            $or: orfilters,
            $and: [
              {
                storeId,
              },
            ],
          },
        }
      );
      console.log("data", data);
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
        console.log("appointments", appointments);
      }
      // const user = data[0];
      console.log("user", user?.id, user);
      return user;
    } catch (error) {
      console.log(error);
    }
  },
}));
