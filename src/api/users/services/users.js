"use strict";
const { register, getUser, updateUser } = require("../utils");
/**
 * users service
 */

module.exports = () => ({
  getUser: async (ctx) => {
    try {
      const result = await getUser(ctx);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    } catch (error) {
      // throw new Error(error.message);
      return { error: error.message };
    }
  },
  registerUser: async (ctx) => {
    try {
      const result = await register(ctx);
      return result;
    } catch (error) {
      throw error.message;
    }
  },
  //   cloverLogin: async (ctx) => {
  //     try {
  //       const result = await login(ctx);
  //       //const result = await testEmail(ctx);

  //       return result;
  //     } catch (error) {
  //       throw error.message;
  //     }
  //   },
  updateUser: async (ctx) => {
    try {
      const result = await updateUser(ctx);
      return result;
    } catch (error) {
      throw error.message;
    }
  },
});
