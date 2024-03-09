module.exports = {
  routes: [
    //   {
    //     method: "GET",
    //     path: "/stores/getStores/:county/:type",
    //     handler: "store.getStores",
    //   },
    //   {
    //     method: "GET",
    //     path: "/stores/populate/:id",
    //     handler: "store.populate",
    //   },
    {
      method: "POST",
      path: "/user-infos/deleteStaff",
      handler: "user-info.deleteStaff",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/user-infos/notificationToken",
      handler: "user-info.notificationToken",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    //   {
    //     method: "POST",
    //     path: "/orders/sendemail",
    //     handler: "order.sendemail",
    //   },
  ],
};
