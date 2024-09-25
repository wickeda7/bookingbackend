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
    {
      method: "POST",
      path: "/register/test", ////api/appointments/specialists/24_30
      handler: "register.test",
      config: {
        policies: [],
      },
    },
  ],
};
