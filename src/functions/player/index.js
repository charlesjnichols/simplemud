/**
 * @module player
 *
 * Central export for all player-related logic.
 */
const hp = require('./hp');
const inventory = require('./inventory');
const leveling = require('./leveling');
const messaging = require('./messaging');

module.exports = {
  ...hp,
  ...inventory,
  ...leveling,
  ...messaging,
};
