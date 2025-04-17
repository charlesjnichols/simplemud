/**
 * @typedef {import('./item')} Item
 */

const { ActorType } = require('../../utils/enums');

/**
 * @typedef {Object} Enemy
 *
 * @property {string|null} id - Unique identifier for the enemy (assigned at spawn).
 * @property {string|null} name - Display name of the enemy.
 * @property {string|null} room - Current room of the enemy.
 * @property {number|null} hp - Current hit points of the enemy.
 * @property {ActorType|null} type - type of Actor.
 * @property {number} maxHp - Maximum hit points.
 * @property {number} weapon - Index of equipped weapon in inventory (-1 if none).
 * @property {number} armor - Index of equipped armor in inventory (-1 if none).
 * @property {number} experience - xp to gain
 * @property {Item[]} loot - List of loot item templates dropped on death.
 * Runtime-Only Properties:
 * @property {number=} nextAttackTime
 */

/** @type {Enemy} */
module.exports = {
  id: null,
  name: null,
  room: null,
  hp: null,
  experience: 0,
  weapon: null,
  armor: null,
  type: ActorType.ENEMY,
  maxHp: 100,
  loot: [],
};
