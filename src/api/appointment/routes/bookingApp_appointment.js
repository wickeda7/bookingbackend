module.exports = {
  routes: [
    {
      method: "GET",
      path: "/appointments/specialists/:id", ////api/appointments/specialists/24_30
      handler: "appointment.specialists",
    },
    {
      method: "GET",
      path: "/appointments/user/:id/:done/:type", ///1api/appointments/user/:id
      handler: "appointment.user",
    },
    {
      method: "PUT",
      path: "/appointments/cancel/:id", //api/appointments/cancel/:id
      handler: "appointment.cancel",
    },
    {
      method: "POST",
      path: "/appointments/message", //api/appointments/cancel/:id
      handler: "appointment.message",
    },
    {
      method: "POST",
      path: "/appointments/notify", //api/appointments/cancel/:id
      handler: "appointment.notify",
    },
    {
      method: "PUT",
      path: "/appointments/booking/:id", //api/appointments/cancel/:id
      handler: "appointment.putBooking",
    },
  ],
};
