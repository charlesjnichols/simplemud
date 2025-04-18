/**
 * @typedef {import('./item')} Item
 */

const { ActorType } = require('../config');

/**
 * @typedef {Object} mob
 *
 * @property {string|null} id - Unique identifier for the mob (assigned at spawn).
 * @property {string|null} name - Display name of the mob.
 * @property {string|null} room - Current room of the mob.
 * @property {number|null} hp - Current hit points of the mob.
 * @property {ActorType|null} type - type of Actor.
 * @property {number} maxHp - Maximum hit points.
 * @property {Item} weapon - Index of equipped weapon in inventory (-1 if none)
 * @property {Item} armor - Index of equipped armor in inventory (-1 if none)
 * @property {number} experience - xp to gain
 * @property {Item[]} loot - List of loot item templates dropped on death.
 *
 * Runtime-Only Properties:
 * @property {number=} nextAttackTime
 */

/** @type {mob} */
module.exports = {
  id: null,
  name: null,
  room: null,
  hp: null,
  experience: 0,
  weapon: null,
  armor: null,
  type: ActorType.MOB,
  maxHp: 100,
  loot: [],
};
