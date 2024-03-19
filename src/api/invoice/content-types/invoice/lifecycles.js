module.exports = {
  async afterCreate(event) {
    const {
      params: {
        data: { specialist, type, store, appointment, createdby },
      },
    } = event;
    console.log(
      "specialist, type, store, appointment",
      specialist,
      type,
      store,
      appointment,
      createdby
    );
    // let data = {};
    if (createdby === "admin") {
      const data = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { id: specialist },
          select: ["id"],
          populate: {
            // @ts-ignore
            userInfo: {
              select: ["pushToken", "socketId"],
            },
          },
        });
      strapi.services["api::invoice.notification"].handlePushTokens(
        data.userInfo.pushToken,
        {
          subject: "Invoice Completed",
          specialist,
          type,
          store,
          appointment,
          createdby,
        }
      );
    } else {
      const data = await strapi.db.query("api::store.store").findOne({
        select: ["name"],
        where: { id: store },
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
      const pushTokens = data.admin.reduce((acc, curr) => {
        if (curr.userInfo.pushToken) {
          acc.push(curr.userInfo.pushToken);
        }
        return acc;
      }, []);
      strapi.services["api::invoice.notification"].handlePushTokens(
        pushTokens,
        {
          subject: "Invoice Completed",
          specialist,
          type,
          store,
          appointment,
          createdby,
        }
      );
    }
  },
};
