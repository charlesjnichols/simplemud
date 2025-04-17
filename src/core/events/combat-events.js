/**
 * @module systems/enemy-spawn-events
 *
 * Spawns enemies into eligible rooms during the game tick.
 *
 * @typedef {import('../models/room').Room} Room
 * @typedef {import('../models/enemy').Enemy} Enemy
 * @typedef {import('../models/player').Player} Player
 */

'use strict';

const _ = require('lodash');
const debug = require('debug')('mud:core:bus:event:spawn-enemies-events');

const { perform_auto_attack } = require('../functions/combat');

/**
 * Registers enemy spawn logic on tick.
 *
 */
function register_combat_events() {
  const { playerRepository, enemyRepository, roomRepository } = require('../datastores').get();
  const { eventBus } = require('../game-bus').get();

  eventBus.on('tick', ({ now }) => {
    for (const room of roomRepository.values()) {
      const players = playerRepository.find_by_room(room.id);
      const enemies = enemyRepository.find_by_room(room.id);

      for (const player of players) {
        if (now >= player.nextAttackTime && enemies.length > 0) {
          debug(`Player '${player.name}' is attacking in room '${player.room}'`);
          perform_auto_attack(player, _.first(enemies), now);
        }
      }
      for (const enemy of enemies) {
        if (now >= enemy.nextAttackTime && players.length > 0) {
          debug(`Enemy '${enemy.name}' is attacking in room '${enemy.room}'`);
          perform_auto_attack(enemy, _.first(players), now);
        }
      }
    }
  });
}

module.exports = {
  register_combat_events,
};
