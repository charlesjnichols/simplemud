/**
 * @typedef {import('./item')} Item
 * @typedef {import('./mob')} Mob
 */

const { RoomType } = require('../config');

/**
 * @typedef {Object} Room
 *
 * Core Properties:
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string[]} spawns
 * @property {number} maxMobs
 * @property {string|null} store
 * @property {RoomType} type
 *
 * Transient (Runtime-only) Properties:
 * @property {Item[]} items - In-memory item list (not persisted)
 * @property {Mob[]} mobs - In-memory item list (not persisted)
 * @property {number} lastSpawnedAt
 * @property {string=} zone
 * @property {string=} portal
 *
 * @property {Record<string, string>} rooms
 * A mapping of direction names (e.g., 'NORTH') to room IDs,
 * and prefixed keys (e.g., '_north') to room labels for UI.
 *
 * Example:
 * {
 *   "NORTH": "2",
 *   "_north": "Town Gates",
 *   "EAST": "3",
 *   "_east": "Armory"
 * }
 */

/** @type {Room} */
const room_model = {
  id: 'null',
  name: 'null',
  description: 'null',
  type: RoomType.PLAIN_ROOM,
  rooms: {},
  store: null,
  spawns: [],
  maxMobs: 0,
  items: [],
  mobs: [],
  lastSpawnedAt: 0,
};

module.exports = room_model;
