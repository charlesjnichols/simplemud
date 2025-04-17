/**
 * @module room
 *
 * Central export for all room-related logic and utilities.
 */

const roomItems = require('./room-items');
const roomNavigation = require('./room-navigation');
const roomUtils = require('./room-utils');
const roomFormatters = require('./room-formatters');

module.exports = {
  ...roomItems,
  ...roomNavigation,
  ...roomUtils,
  ...roomFormatters,
};
