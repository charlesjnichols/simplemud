'use strict';

const _ = require('lodash');
const enemy_model = require('../../models/enemy');

/**
 * @typedef {import('../../models/enemy')} Enemy
 */

/**
 * Creates a new enemy object by cloning the base enemy model and applying provided overrides.
 *
 * @param {Partial<Enemy>} [data={}] - Partial data to override the default enemy model.
 * @param {string} [room] - roomo id
 * @returns {Enemy} The initialized enemy object with helper methods.
 */
function create_enemy(data = {}, room) {
  const enemy = _.cloneDeep(enemy_model);

  // Populate with values or defaults
  Object.assign(enemy, data);

  enemy.room = room;
  enemy.hp = data.maxHp;
  enemy.nextAttackTime = data.nextAttackTime || 0;

  return enemy;
}

module.exports = {
  create_enemy,
};
