"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/access-codes/deleteCode",
      handler: "access-code.deleteCode",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/access-codes/getCode/:id/:code",
      handler: "access-code.getCode",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/access-codes/sendCode",
      handler: "access-code.sendCode",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
