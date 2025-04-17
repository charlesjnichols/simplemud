// src/player/player.js
/**
 * @typedef {import('./item')} Item
 */

/**
 * @typedef {Object} Player
 *
 * Core Attributes:
 * @property {string|null} id - Unique player ID
 * @property {string|null} name - Player's name
 * @property {string|null} password - Encrypted password
 * @property {PlayerRank} rank - Access level (e.g. REGULAR, ADMIN)
 * @property {number} experience - Current experience points
 * @property {number} level - Player's current level
 * @property {number} class - Player's current class
 * @property {string} room - ID of the current room
 * @property {ActorType} type - type of Actor
 * @property {Item} weapon - Index of equipped weapon in inventory (-1 if none)
 * @property {Item} armor - Index of equipped armor in inventory (-1 if none)
 * @property {number} hp - Current hit points
 * @property {number} maxHp - Maximum hit points
 * @property {number} money - Player gold
 * @property {Item[]} inventory - Items the player is carrying
 * @property {{ STRENGTH: number, DEXTERITY: number, INTELLIGENCE: number }} attributes - Stat block
 *
 * Runtime-Only Properties:
 * @property {number=} nextAttackTime
 * @property {number=} lastSentHp
 * @property {number=} lastStatbarTime
 *
 */
const { PlayerRank, ActorType } = require('../../utils/enums');

/** @type {Player} */
module.exports = {
  id: null,
  name: null,
  password: null,
  rank: PlayerRank.REGULAR,
  experience: 0,
  level: 1,
  class: null,
  type: ActorType.PLAYER,
  room: '1',
  weapon: null,
  armor: null,
  hp: 100,
  maxHp: 100,
  money: 0,
  inventory: [],
  attributes: {
    STRENGTH: 1,
    DEXTERITY: 1,
    INTELLIGENCE: 1,
  },
};
