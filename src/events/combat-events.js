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
 * Registers auto-attack combat behavior for both players and enemies on each game tick.
 *
 * On each tick:
 * - Players and enemies in the same room check if they are eligible to auto-attack
 *   based on `nextAttackTime` and the presence of valid targets.
 * - The first enemy or player in the room is selected as the target for the attack.
 * - `perform_auto_attack` is invoked to simulate the attack and handle combat resolution.
 *
 * Requires repositories and the global event bus to be initialized via `get()`.
 *
 * @returns {void}
 */
function register_combat_events() {
  const { playerRepository, enemyRepository, roomRepository } = require('../repository/repositories').get();
  const { eventBus } = require('./event-bus').get();

  /**
   * Handles the `tick` event to check and refresh stores.
   *
   * @param {import('./event-types').TickEvent} param0
   */
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
