const { Expo } = require("expo-server-sdk");
const { push } = require("../../../../config/middlewares");
const expo = new Expo();
module.exports = {
  handlePushTokens(token, data) {
    // console.log("token", token);
    // console.log("data", data);
    // console.log("token", typeof token);
    let pushTokens = [];
    if (typeof token === "string") {
      pushTokens.push(token);
    } else {
      pushTokens = token;
    }
    let notifications = [];
    const title = data.subject;
    delete data.subject;
    let body = `Invoice Completed by ${data.createdby}`;
    delete data.createdby;

    for (let pushToken of pushTokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }

      notifications.push({
        to: pushToken,
        sound: "default",
        title,
        body,
        data,
      });
    }
    //@ts-ignore
    let chunks = expo.chunkPushNotifications(notifications);
    (async () => {
      for (let chunk of chunks) {
        try {
          let receipts = await expo.sendPushNotificationsAsync(chunk);
          console.log("receipts", receipts);
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    })();
  },
};
