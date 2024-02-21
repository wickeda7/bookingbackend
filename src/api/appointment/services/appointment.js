"use strict";

/**
 * appointment service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::appointment.appointment",
  ({ strapi }) => ({
    specialists: async (ctx, next) => {
      const { id } = ctx.params;
      const ids = id.split("_");
      try {
        const data = await strapi.entityService.findMany(
          "plugin::users-permissions.user",
          {
            filters: {
              id: {
                $in: ids,
              },
            },
            fields: ["id"],
            populate: {
              appointmentsSpecialist: {
                filters: {
                  done: {
                    $eq: false,
                  },
                },
              },
            },
          }
        );
        return data;
      } catch (error) {}
    },
    cancel: async (ctx, next) => {
      const { id } = ctx.params;
      try {
        const data = await strapi.entityService.update(
          "api::appointment.appointment",
          id,
          {
            data: {
              canceled: true,
            },
          }
        );
        return data;
      } catch (error) {
        console.log("error", error);
      }
    },
    user: async (ctx, next) => {
      const { id, done, type } = ctx.params;
      let field = "";
      if (type === "specialist") {
        field = "specialistID";
      } else if (type === "store") {
        field = "storeID";
      } else {
        field = "userID";
      }
      try {
        const data = await strapi.entityService.findMany(
          "api::appointment.appointment",
          {
            filters: {
              [field]: {
                $eq: id,
              },
              canceled: {
                $eq: false,
              },
              done: {
                $eq: done,
              },
            },
            sort: "createdAt:desc",
            populate: {
              client: {
                fields: ["id", "email"],
                populate: {
                  userInfo: {
                    fields: [
                      "hours",
                      "specialty",
                      "firstName",
                      "lastName",
                      "phoneNumber",
                    ],
                    populate: {
                      profileImg: {
                        fields: ["url"],
                      },
                    },
                  },
                },
              },
              specialist: {
                fields: ["id", "email"],
                populate: {
                  userInfo: {
                    fields: [
                      "hours",
                      "specialty",
                      "firstName",
                      "lastName",
                      "phoneNumber",
                    ],
                  },
                },
              },
              store: {
                fields: [
                  "id",
                  "name",
                  "address",
                  "city",
                  "state",
                  "zip",
                  "phone",
                  "coordinate",
                ],
                populate: {
                  logo: {
                    fields: ["url"],
                  },
                },
              },
            },
          }
        );
        return data;
      } catch (error) {}
    },
  })
);
