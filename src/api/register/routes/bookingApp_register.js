module.exports = {
  routes: [
    {
      method: "GET",
      path: "/register/getregister", ////api/appointments/specialists/24_30
      handler: "register.getRegister",
      config: {
        policies: [],
      },
    },
  ],
};
