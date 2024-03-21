module.exports = {
  async afterUpdate(event, options) {
    const { result, params } = event;
    const id = result.id;
    const phoneNumber = params.data.phoneNumber;
    const code = params.data.code;
    if (phoneNumber && code) {
      console.log("send text and notification", phoneNumber, code);
      // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
    }
    //   const merchant_id = result.merchant_id;
    //   let userid = null;
    //   let pushToken = null;
    //   let socketuserId = null;
    //   const departureTime = params.data.departureTime;
    //   if (result.user) {
    //     pushToken = result.user.pushToken;
    //     userid = result.user.id;
    //     socketuserId = await strapi.plugins["rest-cache"].services.cacheStore.get(
    //       userid
    //     );
    //   }
    //   const socketMerchantId = await strapi.plugins[
    //     "rest-cache"
    //   ].services.cacheStore.get(merchant_id);
    //   if (pushToken && departureTime) {
    //     let temp = [];
    //     temp.push(pushToken);
    //     // @ts-ignore
    //     pushNotification(temp, result);
    //   }
    //   if (socketuserId) {
    //     const data = { id: result.id };
    //     if (params.data.departureTime)
    //       data.departureTime = params.data.departureTime;
    //     if (params.data.arriveTime) data.arriveTime = params.data.arriveTime;
    //     // @ts-ignore
    //     strapi.ioServer.to(socketuserId).emit("updateOrder", data);
    //   }

    //   const updateType = result.putType;
    //   if (updateType === "Mobile") {
    //     const newOrder = {};
    //     const entry = {};
    //     result.order_content =
    //       typeof result.order_content === "object"
    //         ? result.order_content
    //         : JSON.parse(result.order_content);
    //     entry["id"] = result.id;
    //     entry["user"] = result.user;
    //     newOrder["email"] = result.user.email;
    //     delete result.user;
    //     entry["itemContent"] =
    //       typeof result.itemContent === "object"
    //         ? result.itemContent
    //         : JSON.parse(result.itemContent);
    //     delete result.itemContent;
    //     newOrder["type"] = "update";
    //     newOrder["entry"] = entry;
    //     delete result.updatedBy;
    //     delete result.driver;
    //     newOrder["resOrder"] = result;
    //     // @ts-ignore
    //     // strapi.ioServer.emit("updateOrder", result);
    //     try {
    //       //console.log("socketId", socketId, result);
    //       // @ts-ignore
    //       strapi.ioServer.to(socketMerchantId).emit("updateOrder", result);
    //       await sendCustomerEmail(newOrder);
    //     } catch (error) {
    //       console.log(error);
    //     }
    //}
  },
  async afterCreate(event, options) {
    let { result, params } = event;
    delete result.updatedBy;
    delete result.createdBy;
    //console.log("afterCreate");
    result["type"] = "newBooking";
    const storeId = result.storeID;
    const data = await strapi.db.query("api::store.store").findOne({
      select: ["name"],
      where: { id: storeId },
      populate: {
        // @ts-ignore
        admin: {
          select: ["email"],
          populate: {
            userInfo: {
              select: ["pushToken", "socketId"],
            },
          },
        },
      },
    });
    const storeTokens = data.admin.reduce((acc, curr) => {
      if (curr.userInfo.pushToken) {
        acc.push(curr.userInfo.pushToken);
      }
      return acc;
    }, []);
    try {
      const title = result.timeslot ? "Appointment" : "Walk-in";
      const messageData = {
        title: `New ${title} `,
        message: `You have a new service.`,
        data: result,
      };
      strapi.services["api::appointment.notification"].handlePushTokens(
        storeTokens,
        messageData
      );
    } catch (error) {
      console.log("error push notification", error);
      throw error;
    }
  },
};
