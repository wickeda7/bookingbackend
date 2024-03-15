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
        console.log("error", error);
        throw error;
      })
      .finally();
  },
};
