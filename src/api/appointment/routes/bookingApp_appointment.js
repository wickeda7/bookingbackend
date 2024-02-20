module.exports = {
  routes: [
    {
      method: "GET",
      path: "/appointments/specialists/:id", ////api/appointments/specialists/24_30
      handler: "appointment.specialists",
    },
    {
      method: "GET",
      path: "/appointments/user/:id/:done/:type", ///api/appointments/user/:id
      handler: "appointment.user",
    },
    {
      method: "PUT",
      path: "/appointments/cancel/:id", //api/appointments/cancel/:id
      handler: "appointment.cancel",
    },
  ],
};
