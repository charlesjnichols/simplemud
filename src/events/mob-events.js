/**
 * @module systems/mob-events
 *
 * Spawns mobs into eligible rooms during ticks and handles mob death.
 *
 * @typedef {import('../models/room').Room} Room
 * @typedef {import('../models/mob').Mob} Mob
 * @typedef {import('../models/player').Player} Player
 */

'use strict';

const _ = require('lodash');
const debug = require('debug')('mud:events:mob');
const error = require('debug')('mud:events:mob:error');

const { SPAWN_COOLDOWN } = require('../config');

const { redBold, cyan, cyanBold } = require('../utils/formatting');
const { create_mob } = require('../functions/mob/create-mob');
const { send_to_roomId, send_to_room } = require('../functions/world');
const { add_item } = require('../functions/room');

const { MOB, SYSTEM, PLAYER } = require('./event-types');

/**
 * Registers event listeners for mob spawning and mob death handling.
 */
function register_mob_events() {
  const { mobRepository, roomRepository, itemRepository } = require('../repository/repositories').get();
  const { eventBus } = require('./event-bus').get();

  /**
   * Spawns a mob into a room if eligible.
   *
   * @param {Room} room
   * @param {number} now
   */
  function try_spawn_mob(room, now) {
    const mobs = mobRepository.find_by_room(room.id);
    if (mobs.length >= room.maxMobs) return;

    const spawnId = _.sample(room.spawns);
    if (!spawnId) {
      debug(`Room '${room.id}' has no spawns defined.`);
      return;
    }

    const template = mobRepository.get_template(spawnId);
    const mob = create_mob(template, room.id);
    mobRepository.add(mob);

    room.lastSpawnedAt = now;
    send_to_roomId(room.id, redBold(`${mob.name} enters the room!`));
    debug(`Spawned '${mob.name}' in room '${room.name}' (${room.id})`);
  }

  /**
   * Tick handler to check all rooms for spawn eligibility.
   *
   * @param {import('./event-types').TickEvent} tick
   */
  function handle_tick({ now }) {
    for (const room of roomRepository.values()) {
      if (!room.lastSpawnedAt || now - room.lastSpawnedAt >= SPAWN_COOLDOWN) {
        try_spawn_mob(room, now);
      }
    }
  }

  /**
   * Handles mob death: drops loot and awards XP.
   *
   * @param {import('./event-types').mobDiedEvent} event
   */
  function handle_mob_death(event) {
    const { attacker, mob } = event;
    send_to_room(mob, `${cyanBold(mob.name)} has been defeated by ${redBold(attacker.name)}!`);

    mob.loot?.forEach((loot) => {
      if (_.random(0, 99) >= 50) return;

      const item = itemRepository.get(loot.id);
      if (!item) {
        error('Invalid loot item ID "%s" on mob: %O', loot.id, mob);
        return;
      }

      const room = roomRepository.get(mob.room);
      if (!room) {
        error('Mob %s is missing a valid room', mob.id);
        return;
      }

      add_item(room, item);
      send_to_room(mob, cyan(`${item.name} drops to the ground.`));
    });

    eventBus.emit(PLAYER.XP_GAINED, { player: attacker, amount: mob.experience });
    mobRepository.delete(mob.id);
  }

  eventBus.on(SYSTEM.TICK, handle_tick);
  eventBus.on(MOB.DIED, handle_mob_death);
}

module.exports = {
  register_mob_events,
};
