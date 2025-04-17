/**
 * @module player
 *
 * Central export for all player-related logic.
 */

const constants = require('./constants');
const hp = require('./hp');
const inventory = require('./inventory');
const leveling = require('./leveling');
const messaging = require('./messaging');

module.exports = {
  ...constants,
  ...hp,
  ...inventory,
  ...leveling,
  ...messaging,
};
