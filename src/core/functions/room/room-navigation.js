/**
 * @module room/utils/get_exits
 *
 * Utility to extract and format a room's available exits as a string.
 *
 * @typedef {import('../../../models/room').Room} Room
 */

'use strict';

const { Direction } = require('../../../utils/enums');

/**
 * Returns a formatted string of available exits for a room.
 *
 * Only includes directions where the linked room is not 0 or null.
 * Useful for display purposes in room descriptions.
 *
 * Example output: `"NORTH  EAST  SOUTH"`
 *
 * @param {Room} room - The room object containing directional links.
 * @returns {string} A space-separated list of available direction names.
 */
const get_exits = (room) =>
  Object.keys(Direction)
    .filter((dir) => room.rooms?.[dir] !== 0 && room.rooms?.[dir] != null)
    .join('  ');

module.exports = {
  get_exits,
};
