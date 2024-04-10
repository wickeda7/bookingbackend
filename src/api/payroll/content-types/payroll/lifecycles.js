module.exports = {
  async afterCreate(event) {
    const {
      result: { id, startDate, endDate, specialistId },
    } = event;
    const data = await strapi.query("plugin::users-permissions.user").findOne({
      where: { id: specialistId },
      select: ["id"],
      populate: {
        // @ts-ignore
        userInfo: {
          select: ["pushToken", "socketId"],
        },
      },
    });
    console.log("data", data);
    if (data.userInfo.pushToken) {
      strapi.services["api::appointment.notification"].handlePushTokens(
        data.userInfo.pushToken,
        {
          subject: "Payroll",
          message: "You have a new payroll.",
          data: { specialistId, type: "newPayroll" },
        }
      );
    }
  },
};
