/**
 * @typedef {import('./item')} Item
 */

const { ActorType } = require('../config');

/**
 * @typedef {Object} Mob
 *
 * @property {string} id - Unique identifier for the mob (assigned at spawn).
 * @property {string} name - Display name of the mob.
 * @property {string} room - Current room of the mob.
 * @property {number} hp - Current hit points of the mob.
 * @property {ActorType} type - type of Actor.
 * @property {number} maxHp - Maximum hit points.
 * @property {Item} weapon - Index of equipped weapon in inventory (-1 if none)
 * @property {Item} armor - Index of equipped armor in inventory (-1 if none)
 * @property {number} experience - xp to gain
 * @property {Item[]} loot - List of loot item templates dropped on death.
 *
 * Runtime-Only Properties:
 * @property {number} nextAttackTime
 */

/** @type {Mob} */
module.exports = {
  id: '',
  name: '',
  room: '',
  hp: '',
  experience: 0,
  weapon: null,
  armor: null,
  type: ActorType.MOB,
  maxHp: 100,
  loot: [],
};
