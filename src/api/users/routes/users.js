module.exports = {
  routes: [
    {
      method: "GET",
      path: "/users/:email",
      handler: "users.getUser",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      // Path defined with an URL parameter
      method: "POST",
      path: "/users/register", ///api/users/register
      handler: "users.registerUser",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      // Path defined with an URL parameter
      method: "PUT",
      path: "/users/:id", ///api/users/register
      handler: "users.updateUser",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    //   {
    //     // Path defined with an URL parameter
    //     method: "PUT",
    //     path: "/users/:id",
    //     handler: "users.updateUser",
    //     config: {
    //       policies: [],
    //       middlewares: [],
    //     },
    //},
  ],
};
