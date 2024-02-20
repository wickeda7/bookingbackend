module.exports = {
  routes: [
    {
      method: "GET",
      path: "/review/specialist/:id",
      handler: "review.specialist",
    },
    {
      method: "GET",
      path: "/review/store/:id",
      handler: "review.store",
    },
    //   {
    //     method: "POST",
    //     path: "/orders",
    //     handler: "order.postOrders",
    //   },
    //   {
    //     method: "POST",
    //     path: "/orders/sendemail",
    //     handler: "order.sendemail",
    //   },
  ],
};
