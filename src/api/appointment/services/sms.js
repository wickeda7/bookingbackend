module.exports = {
  sendSms(phoneNumber, message) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const myNum = process.env.MYNUM;
    const twilioNum = process.env.TWILIONUM;
    const client = require("twilio")(accountSid, authToken);

    return client.messages
      .create({
        body: message,
        from: twilioNum, //the phone number provided by Twillio
        to: phoneNumber, // your own phone number
      })
      .then((message) => {
        return message.sid;
      })
      .catch(function (error) {
        throw error;
      })
      .finally();
    // client.messages
    //   .create({
    //     body: `Hello ${firstName} ${lastName}, Please use this code to add to our staff system: ${code} go to BookingApp: ${link}`,
    //     from: twilioNum, //the phone number provided by Twillio
    //     to: phoneNumber, // your own phone number
    //   })
    //   .then((message) => {
    //     console.log("message", message);
    //     return message.sid;
    //   })
    //   .catch((err) => {
    //     throw err;
    //     console.log("err", err);
    //     return err;
    //   });
  },
};
