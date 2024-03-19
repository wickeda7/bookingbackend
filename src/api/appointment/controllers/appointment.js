"use strict";

/**
 * appointment controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::appointment.appointment",
  ({ strapi }) => ({
    specialists: async (ctx, next) => {
      // const { id } = ctx.params;
      try {
        const data = await strapi
          .service("api::appointment.appointment")
          .specialists(ctx);
        ctx.send(
          {
            data,
          },
          200
        );
      } catch (error) {}
    },
    user: async (ctx, next) => {
      // const { id } = ctx.params;
      try {
        const data = await strapi
          .service("api::appointment.appointment")
          .user(ctx);
        ctx.send(
          {
            data,
          },
          200
        );
      } catch (error) {}
    },
    cancel: async (ctx, next) => {
      // const { id } = ctx.params;
      try {
        const data = await strapi
          .service("api::appointment.appointment")
          .cancel(ctx);
        ctx.send(
          {
            data,
          },
          200
        );
      } catch (error) {}
    },
    message: async (ctx, next) => {
      // const { id } = ctx.params;
      try {
        const data = await strapi
          .service("api::appointment.appointment")
          .message(ctx);
        ctx.send(
          {
            data,
          },
          200
        );
      } catch (error) {}
    },
    notify: async (ctx, next) => {
      // const { id } = ctx.params;
      try {
        const data = await strapi
          .service("api::appointment.appointment")
          .notify(ctx);
        ctx.send(
          {
            data,
          },
          200
        );
      } catch (error) {}
    },
    putBooking: async (ctx, next) => {
      // const { id } = ctx.params;
      try {
        const data = await strapi
          .service("api::appointment.appointment")
          .putBooking(ctx);
        ctx.send(
          {
            data,
          },
          200
        );
      } catch (error) {}
    },
  })
);
