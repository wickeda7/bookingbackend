'use strict';

/**
 * timecard service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::timecard.timecard');
