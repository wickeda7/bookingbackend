'use strict';

/**
 * sub-service service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::sub-service.sub-service');
