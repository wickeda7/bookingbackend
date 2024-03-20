const { Expo } = require("expo-server-sdk");
const { push } = require("../../../../config/middlewares");
const expo = new Expo();
module.exports = {
  handlePushTokens(token, data) {
    // console.log("token", token);
    // console.log("data", data);
    let pushTokens = [];
    let title = "";
    let body = "";
    let sendData = {};
    pushTokens.push(token);
    let notifications = [];
    if (typeof token === "string") {
      pushTokens.push(token);
      title = data.timeslot ? "Appointment" : "Walk-in";
      body = `You have a new service.`;
      if (data.subject) {
        title = data.subject;
        body = data.message;
        sendData = {
          id: data.result.id,
          timeslot: data.result.timeslot,
          date: data.result.date,
          services: data.result.services,
        };
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
        data: sendData,
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
