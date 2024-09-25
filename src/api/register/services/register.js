"use strict";

const { filter, sort, pop } = require("../../../../config/middlewares");
const { errors } = require("@strapi/utils");
const { UnauthorizedError } = errors;
/**
 * register service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::register.register", ({ strapi }) => ({
  test: async (ctx) => {
    const { name } = ctx.request.body.data;
    const token = ctx.request.header.authorization; //valid-token
    console.log("token", token);
    console.log("name", name);
    if (token !== "valid-token") {
      throw new UnauthorizedError("Invalid token");
    }
    return { name };
  },
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
            populate: {
              specialists: {
                fields: ["id"],
                populate: {
                  userInfo: {
                    fields: ["firstName", "lastName"],
                  },
                },
              },
            },
            sort: { createdAt: "desc" },
            limit: 10,
          }
        );
        if (appointments.length > 0) {
          const services = appointments.map((a) => {
            const { services, updatedAt, specialists } = a;
            let specialist = null;
            if (specialists.length > 0) {
              const {
                id,
                userInfo: { firstName, lastName },
              } = specialists[0];

              specialist = { id, firstName, lastName };
            }
            console.log("specialist", specialist);
            return { services, updatedAt, specialist };
          });
          user.prevServices = services;
        }
        //console.log("appointments", appointments);
      }
      // const user = data[0];
      console.log("user", user?.id, user);
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
}));
