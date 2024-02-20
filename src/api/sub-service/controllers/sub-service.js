'use strict';

/**
 * sub-service controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::sub-service.sub-service');
