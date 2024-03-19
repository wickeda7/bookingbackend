module.exports = {
  async afterCreate(event) {
    const {
      params: {
        data: { specialist, type, store, appointment, createdby },
      },
    } = event;
    let data = {};
    if (createdby === "admin") {
      data = await strapi.query("plugin::users-permissions.user").findOne({
        where: { id: specialist },
        select: ["id"],
        populate: {
          // @ts-ignore
          userInfo: {
            select: ["pushToken", "socketId"],
          },
        },
      });
      //   data {
      //     id: 52,
      //     userInfo: {
      //       pushToken: 'ExponentPushToken[HiHj4UEZCDFjszQ78XMJIN]',
      //       socketId: null
      //     }
      //   } Invoice completed
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
      console.log("data", data);
    }

    console.log(
      "specialist, type, store, appointment",
      specialist,
      type,
      store,
      appointment
    );
  },
};
