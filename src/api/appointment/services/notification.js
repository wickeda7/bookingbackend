const { Expo } = require("expo-server-sdk");
const { push } = require("../../../../config/middlewares");
const expo = new Expo();
module.exports = {
  handlePushTokens(token, data) {
    let pushTokens = [];
    pushTokens.push(token);
    let notifications = [];
    //console.log("data", data);
    //console.log("psuhTokens", pushTokens);
    const type = data.timeslot ? "Appointment" : "Walk-in";

    for (let pushToken of pushTokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }

      notifications.push({
        to: pushToken,
        sound: "default",
        title: type,
        body: `You have a new service.`,
        data: data,
      });
    }
    //@ts-ignore
    let chunks = expo.chunkPushNotifications(notifications);
    (async () => {
      for (let chunk of chunks) {
        try {
          let receipts = await expo.sendPushNotificationsAsync(chunk);
          console.log(receipts);
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    })();
  },
};
