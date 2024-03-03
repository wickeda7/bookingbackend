"use strict";

/**
 * access-code router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::access-code.access-code");
