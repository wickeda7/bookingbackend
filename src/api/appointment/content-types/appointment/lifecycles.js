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
  },
  async afterCreate(event, options) {
    let { result, params } = event;
    delete result.updatedBy;
    delete result.createdBy;
    result["type"] = "newBooking";
    const bookingId = result.id;
    const type = result.timeslot === null ? "walkin" : "appointment";
    if (result.services) {
      let services =
        typeof result.services === "string"
          ? JSON.parse(result.services)
          : result.services;
      const status = "pending";
      services = services.map((service) => {
        return { ...service, status, bookingId, type };
      });
      result["services"] = services;
    }
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
    if (result.userID) {
      const userData = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { id: result.userID },
          select: ["id"],
          populate: {
            // @ts-ignore
            userInfo: {
              select: ["firstName", "lastName"],
            },
          },
        });
      result["client"] = { id: userData.id, ...userData.userInfo };
    }
    if (result.registerId) {
      const clientData = await strapi.db
        .query("api::register.register")
        .findOne({
          where: { id: result.registerId },
        });
      delete clientData.updatedBy;
      delete clientData.createdBy;
      result["client"] = clientData;
    }
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
      console.log("send push notification", storeTokens, messageData);
      strapi.services["api::appointment.notification"].handlePushTokens(
        storeTokens,
        messageData
      );
      if (result.timeslot && result.specialistID) {
        const specialistData = await strapi
          .query("plugin::users-permissions.user")
          .findOne({
            where: { id: result.specialistID },
            select: ["id"],
            populate: {
              // @ts-ignore
              userInfo: {
                select: ["pushToken"],
              },
            },
          });
        if (specialistData.userInfo.pushToken) {
          strapi.services["api::appointment.notification"].handlePushTokens(
            specialistData.userInfo.pushToken,
            messageData
          );
        }
      }
    } catch (error) {
      console.log("error push notification", error);
      throw error;
    }
  },
};
