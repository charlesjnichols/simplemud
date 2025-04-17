/**
 * @typedef {import('../../utils/enums').RoomType} RoomType
 * @typedef {import('./item')} Item
 */

/**
 * @typedef {Object} Room
 *
 * Core Properties:
 * @property {string|null} id
 * @property {string|null} name
 * @property {string|null} description
 * @property {string[]} spawns
 * @property {number} maxEnemies
 * @property {string[]} rooms
 * @property {string|null} store
 * @property {RoomType|null} type
 *
 * Transient (Runtime-only) Properties:
 * @property {Item[]=} items - In-memory item list (not persisted)
 * @property {import('./enemy').Enemy[]=} enemies - In-memory item list (not persisted)
 * @property {number=} lastSpawnedAt
 */

/** @type {Room} */
const room_model = {
  id: null,
  name: null,
  description: null,
  type: null,
  rooms: null,
  store: null,
  spawns: [],
  maxEnemies: 0,
};

module.exports = room_model;
