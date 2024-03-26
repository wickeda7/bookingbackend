"use strict";
const HOST_URL = process.env.HOST_URL;
module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    process.nextTick(() => {
      // @ts-ignore
      strapi.ioServer = require("socket.io")(strapi.server.httpServer, {
        cors: {
          // cors setup
          // "Allow-Origin": HOST_URL,
          // origin: [HOST_URL, "http://localhost:3000"],
          origin: "*",
          methods: ["GET", "POST"],
          allowedHeaders: ["my-custom-header"],
          credentials: true,
        },
      });
      strapi.ioServer.use((socket, next) => {
        const userid = socket.handshake.auth.userId;
        const userInfoid = socket.handshake.auth.userInfoId;
        try {
          strapi.services["api::user-info.user-info"].updateSocketId({
            userInfoid,
            socketId: socket.id,
          });
        } catch (error) {
          throw error;
        }
        console.log("a user connected", userid);
        console.log("userInfoId", userInfoid);
        console.log("socket.id", socket.id);
        if (!userid) {
          return next(new Error("invalid merchantId"));
        }
        socket.userid = userid;
        next();
      });
      strapi.ioServer.on("connection", (socket) => {
        socket.on("disconnect", () => {
          console.log("user disconnected", socket.userid);
        });
      });
    });
  },
};
