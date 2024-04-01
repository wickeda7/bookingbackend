"use strict";

/**
 * store service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::store.store", ({ strapi }) => ({
  settings: async (ctx, next) => {
    const id = ctx?.params ? ctx.params.id : ctx;
    try {
      const entry = await strapi.entityService.findOne("api::store.store", id, {
        populate: {
          images: {
            fields: ["url"],
          },
          logo: {
            fields: ["url"],
          },
          employee: {
            fields: ["email", "id"],
            filters: {
              blocked: {
                $eq: false,
              },
            },
            populate: {
              userInfo: {
                fields: [
                  "firstName",
                  "lastName",
                  "firebase",
                  "phoneNumber",
                  "hours",
                  "specialty",
                  "about",
                  "experience",
                  "displayColor",
                  "code",
                  "pushToken",
                  "socketId",
                  "totalDeduct",
                  "tipDeduct",
                  "perDay",
                ],
                populate: {
                  profileImg: {
                    fields: ["url"],
                  },
                  images: {
                    fields: ["url"],
                  },
                },
              },
            },
          },
          services: {
            populate: {
              items: true,
              sub_services: {
                populate: {
                  items: true,
                },
              },
            },
          },
        },
      });
      return entry;
    } catch (error) {
      console.log("error", error);
    }
  },
  populate: async (ctx, next) => {
    const id = ctx?.params ? ctx.params.id : ctx;
    try {
      const entry = await strapi.entityService.findOne("api::store.store", id, {
        fields: ["name"],
        populate: {
          images: {
            fields: ["url"],
          },
          employee: {
            fields: ["email", "createdAt", "id"],
            filters: {
              blocked: {
                $eq: false,
              },
            },

            populate: {
              appointmentsSpecialists: {
                filters: {
                  done: {
                    $eq: false,
                  },
                  canceled: {
                    $eq: false,
                  },
                },
              },
              userInfo: {
                fields: [
                  "firstName",
                  "lastName",
                  "firebase",
                  "phoneNumber",
                  "hours",
                  "specialty",
                  "about",
                  "experience",
                  "displayColor",
                  "code",
                  "pushToken",
                  "socketId",
                  "totalDeduct",
                  "tipDeduct",
                  "perDay",
                ],
                populate: {
                  profileImg: {
                    fields: ["url"],
                  },
                  images: {
                    fields: ["url"],
                  },
                },
              },
              role: true,
            },
          },
          services: {
            filters: {
              enable: {
                $eq: true,
              },
            },
            populate: {
              items: {
                filters: {
                  enable: {
                    $eq: true,
                  },
                },
              },
              sub_services: {
                filters: {
                  enable: {
                    $eq: true,
                  },
                },
                populate: {
                  items: {
                    filters: {
                      enable: {
                        $eq: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      return entry;
    } catch (error) {
      console.log(error);
    }
  },
  getStores: async (ctx, next) => {
    const { county, type } = ctx.params;

    try {
      const data = await strapi.entityService.findMany("api::store.store", {
        filters: {
          county: {
            $eq: county,
          },
          type: {
            $eq: type,
          },
        },
        populate: {
          logo: true,
        },
      });

      return data;
    } catch (error) {
      console.log(error);
    }
  },
}));
