module.exports = {
  routes: [
    {
      method: "GET",
      path: "/invoices/payroll/:id/:start/:end", /////api/invoices/payroll
      handler: "invoice.payroll",
    },
    {
      method: "GET",
      path: "/invoices/test/:clientId/:specialistId/:appointId", /////api/invoices/payroll
      handler: "invoice.test",
    },
  ],
};
