"use strict";

/**
 * review service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::review.review", ({ strapi }) => ({
  populateStore: async (ctx, next) => {
    const { id } = ctx.params;
    try {
      const entry = await strapi.entityService.findOne("api::store.store", id, {
        fields: ["name"],
        populate: {
          reviews: {
            // fields: [
            //   /* list the course fields you want to populate */
            // ],
            sort: "createdAt:desc", // You can use id, publishedAt or updatedAt here, depends on your sorting prefrences
            // offset: _start,
            //limit: _limit // I must admit I haven't tested `offset` and `limit` on the populated related field
            populate: {
              reviewed_by: {
                fields: ["firstName", "lastName"],
                populate: {
                  userInfo: {
                    fields: [],
                    populate: {
                      profileImg: {
                        fields: ["url"],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      return entry.reviews;
    } catch (error) {
      console.log(error);
    }
  },
  populateSpecialist: async (ctx, next) => {
    const { id } = ctx.params;
    console.log("id", id);
    try {
      const entry = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        id,
        {
          fields: ["firstName", "lastName"],
          populate: {
            reviews_specialist: {
              // fields: [
              //   /* list the course fields you want to populate */
              // ],
              sort: "createdAt:desc", // You can use id, publishedAt or updatedAt here, depends on your sorting prefrences
              // offset: _start,
              //limit: _limit // I must admit I haven't tested `offset` and `limit` on the populated related field
              populate: {
                reviewed_by: {
                  fields: ["firstName", "lastName"],
                  populate: {
                    userInfo: {
                      fields: [],
                      populate: {
                        profileImg: {
                          fields: ["url"],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        }
      );
      return entry.reviews_specialist;
    } catch (error) {
      console.log(error);
    }
  },
}));
