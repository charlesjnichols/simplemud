/**
 * @module systems/mob-spawn-events
 *
 * Spawns mobs into eligible rooms during the game tick.
 *
 * @typedef {import('../models/room').Room} Room
 * @typedef {import('../models/mob').Mob} Mob
 * @typedef {import('../models/player').Player} Player
 */

'use strict';

const _ = require('lodash');
const debug = require('debug')('mud:core:bus:event:spawn-mobs-events');

const { perform_auto_attack } = require('../functions/combat');
const { SYSTEM } = require('./event-types');

/**
 * Registers auto-attack combat behavior for both players and mobs on each game tick.
 *
 * On each tick:
 * - Players and mobs in the same room check if they are eligible to auto-attack
 *   based on `nextAttackTime` and the presence of valid targets.
 * - The first mob or player in the room is selected as the target for the attack.
 * - `perform_auto_attack` is invoked to simulate the attack and handle combat resolution.
 *
 * Requires repositories and the global event bus to be initialized via `get()`.
 *
 * @returns {void}
 */
function register_combat_events() {
  const { playerRepository, mobRepository, roomRepository } = require('../repository/repositories').get();
  const { eventBus } = require('./event-bus').get();

  /**
   * Handles the `tick` event to check and refresh stores.
   *
   * @param {import('./event-types').TickEvent} param0
   */
  eventBus.on(SYSTEM.TICK, ({ now }) => {
    for (const room of roomRepository.values()) {
      const players = playerRepository.find_by_room(room.id);
      const mobs = mobRepository.find_by_room(room.id);

      for (const player of players) {
        if (now >= player.nextAttackTime && mobs.length > 0) {
          debug(`Player '${player.name}' is attacking in room '${player.room}'`);
          perform_auto_attack(player, _.first(mobs), now);
        }
      }
      for (const mob of mobs) {
        if (now >= mob.nextAttackTime && players.length > 0) {
          debug(`Mob '${mob.name}' is attacking in room '${mob.room}'`);
          perform_auto_attack(mob, _.first(players), now);
        }
      }
    }
  });
}

module.exports = {
  register_combat_events,
};
