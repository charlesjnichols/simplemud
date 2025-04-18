/**
 * @module systems/mob-events
 *
 * Spawns mobs into eligible rooms during the game tick and handles mob death events.
 *
 * @typedef {import('../models/room').Room} Room
 * @typedef {import('../models/mob').Mob} Mob
 * @typedef {import('../models/player').Player} Player
 */

'use strict';

const _ = require('lodash');

const { redBold, cyan, cyanBold } = require('../utils/formatting');
const { create_mob } = require('../functions/mob/create-mob');
const { send_to_roomId, send_to_room } = require('../functions/world');
const { add_item } = require('../functions/room');

const debug = require('debug')('mud:core:bus:event:spawn-mobs-events');

const SPAWN_COOLDOWN = 60 * 1000;

/**
 * Registers two event handlers:
 *
 * 1. **'tick' event**: Spawns new mobs into eligible rooms if the spawn cooldown has passed
 *    and the current number of mobs is below the room's max.
 *    - Selects a random mob type from the room's `spawns`.
 *    - Sends an announcement to the room.
 *
 * 2. **'mob.died' event**: Handles loot drop and XP gain upon an mob’s death.
 *    - Drops items from the mob's loot table with a chance roll.
 *    - Emits a `player.xp.gain` event to award XP to the attacker.
 *    - Deletes the mob from the repository.
 *
 * @returns {void}
 */
function register_mob_events() {
  const { mobRepository, roomRepository, itemRepository } = require('../repository/repositories').get();
  const { eventBus } = require('./event-bus').get();

  /**
   * Handles the `tick` event to check and refresh stores.
   *
   * @param {import('./event-types').TickEvent} param0
   */
  eventBus.on('tick', ({ now }) => {
    for (const room of roomRepository.values()) {
      if (!room.lastSpawnedAt || now - room.lastSpawnedAt >= SPAWN_COOLDOWN) {
        const mobs = mobRepository.find_by_room(room.id);
        if (mobs.length < room.maxMobs) {
          const spawnId = _.sample(room.spawns);

          const mobTemplate = mobRepository.get_template(spawnId);
          const mob = create_mob(mobTemplate, room.id);
          mobRepository.add(mob);

          room.lastSpawnedAt = now;

          send_to_roomId(room.id, `${redBold(mob.name)} enters the room!`);
          debug(`Spawned mob '${mob.name}' in room '${room.name}' ${room.id}`);
        }
      }
    }
  });

  /**
   * Handles the `tick` event to check and refresh stores.
   *
   * @param {import('./event-types').mobDiedEvent} param0
   */
  eventBus.on('mob.died', ({ attacker, mob }) => {
    send_to_room(mob, `${cyanBold(mob.name)} has been defeated by ${redBold(attacker.name)}!`);

    mob.loot?.forEach((loot) => {
      if (_.random(0, 99) < loot.chance) {
        const item = itemRepository.get(loot.itemId);
        add_item(mob.room, item);
        send_to_room(mob.room, cyan(`${item.name} drops to the ground.`));
      }
    });

    eventBus.emit('player.xp.gain', { player: attacker, amount: mob.experience });
    mobRepository.delete(mob.id);
  });
}

module.exports = {
  register_mob_events,
};
