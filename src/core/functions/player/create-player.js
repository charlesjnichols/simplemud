/**
 * Creates and initializes a player object with runtime-only fields,
 * encrypted password protection, and modular behavior methods.
 *
 * @module player/create-player
 */

/**
 * @typedef {import('../../../models/player')} Player
 */

const _ = require('lodash');
const player_model = require('../../models/player');
const { encryptPassword, isEncrypted } = require('../../../utils/password-vault');

/**
 * List of runtime-only fields that should not be saved with the player object.
 * These include connection-related and volatile in-session state.
 *
 * @type {string[]}
 */
const runtimeOnly = ['nextAttackTime', 'lastSentHp', 'lastStatbarTime'];

/**
 * Creates a new player instance and attaches modular behavior.
 *
 * @param {Partial<Player>} [data={}] - The persisted player data to load, or defaults.
 * @returns {import('../../models/player').Player} Fully initialized player object with all behavior methods attached.
 */
function create_player(data = {}) {
  const player = _.cloneDeep(player_model);
  Object.assign(player, data);

  // Runtime-only state
  player.nextAttackTime = data.nextAttackTime || 0;
  player.lastSentHp = data.nextAttackTime || 0;
  player.lastStatbarTime = data.nextAttackTime || 0;
  player.money = data.nextAttackTime || 10000;
  player.hp = data.maxHp || 100;

  // Secure password
  player.password = isEncrypted(player.password) ? player.password : encryptPassword(player.password || '');

  // @ts-ignore
  return Object.seal(player);
}

module.exports = {
  create_player,
  runtimeOnly,
};
