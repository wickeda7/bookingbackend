const { Expo } = require("expo-server-sdk");
const { push } = require("../../../../config/middlewares");
const expo = new Expo();
module.exports = {
  handlePushTokens(token, data) {
    // console.log("token", token);
    // console.log("data", data);
    // console.log("token", typeof token);
    let pushTokens = [];
    let title = "";
    let body = "";
    let sendData = {};
    let notifications = [];
    if (typeof token === "string") {
      pushTokens.push(token);
      title = data.title;
      body = data.message;
      if (data.result) {
        sendData = {
          id: data.result.id,
          timeslot: data.result.timeslot,
          date: data.result.date,
          services: data.result.services,
        };
      } else {
        sendData = data.data;
      }
    } else {
      pushTokens = token;
      title = data.title;
      body = data.message;
      sendData = data.data;
    }
    console.log("pushTokens", pushTokens);
    console.log("title", title);
    console.log("body", body);
    console.log("sendData", sendData);

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
        data: JSON.stringify(sendData),
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
