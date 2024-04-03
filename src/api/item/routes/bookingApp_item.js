module.exports = {
  routes: [
    {
      method: "POST",
      path: "/items/bulk", ///api/items
      handler: "item.bulk",
    },
  ],
};
