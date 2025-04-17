/**
 * Utility to serialize a player object by omitting runtime-only fields
 * that should not be saved to disk (e.g., connection references, temporary state).
 *
 * @module player/serializePlayer
 */

const _ = require('lodash');
const { runtimeOnly } = require('./create-player');

/**
 * Serializes a player object for storage or transmission by removing transient fields.
 *
 * @param {object} player - The full in-memory player object.
 * @returns {object} A stripped-down copy of the player suitable for saving.
 */
function serialize_player(player) {
  return _.omit(player, runtimeOnly);
}

module.exports = {
  serialize_player,
};
