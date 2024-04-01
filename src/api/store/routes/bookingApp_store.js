module.exports = {
  routes: [
    {
      method: "GET",
      path: "/stores/getStores/:county/:type",
      handler: "store.getStores",
    },
    {
      method: "GET",
      path: "/stores/populate/:id",
      handler: "store.populate",
    },
    {
      method: "GET",
      path: "/stores/settings/:id",
      handler: "store.settings",
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
