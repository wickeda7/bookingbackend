module.exports = {
  routes: [
    {
      method: "GET",
      path: "/invoices/payroll/:id/:start/:end", /////api/invoices/payroll
      handler: "invoice.payroll",
    },
  ],
};
