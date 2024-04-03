"use strict";

/**
 * item service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::item.item", ({ strapi }) => ({
  bulk: async (ctx, next) => {
    let { data } = ctx.request.body;
    //console.log("bulk", data);
    try {
      let { newData, updateData } = data.reduce(
        (acc, item) => {
          if (!item.service && !item.sub_service) {
            delete item.createdAt;
            delete item.updatedAt;
            acc.updateData.push(item);
          } else {
            delete item.id;
            acc.newData.push(item);
          }
          return acc;
        },
        { newData: [], updateData: [] }
      );
      const res = [];
      const newDataLength = newData.length;
      //   console.log("newData", typeof newData[0].service, newData[0].service);
      //   console.log("updateData", updateData);
      if (newDataLength > 0) {
        newData.forEach(async (item) => {
          const entry = await strapi.entityService.create("api::item.item", {
            data: item,
          });
          //console.log("entry", entry);
          res.push(entry);
        });
      }
      if (res.length === newDataLength) {
        return res;
      }

      //   return res;
      //   console.log("newItems", res);
      //   const data = await strapi.service("api::item.item").bulk(ctx);
      //   ctx.send(
      //     {
      //       data,
      //     },
      //     200
      //   );
    } catch (error) {}
  },
}));
