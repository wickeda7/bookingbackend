'use strict';

/**
 * sub-service router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::sub-service.sub-service');
