module.exports = {
  routes: [
    {
      method: "POST",
      path: "/payrolls/message", //api/payrolls/
      handler: "payroll.message",
    },
  ],
};
