/**
 * @module systems/enemy-events
 *
 * Spawns enemies into eligible rooms during the game tick and handles enemy death events.
 *
 * @typedef {import('../models/room').Room} Room
 * @typedef {import('../models/enemy').Enemy} Enemy
 * @typedef {import('../models/player').Player} Player
 */

'use strict';

const _ = require('lodash');

const { redBold, cyan, cyanBold } = require('../utils/formatting');
const { create_enemy } = require('../functions/enemy/create-enemy');
const { send_to_roomId, send_to_room } = require('../functions/world');
const { add_item } = require('../functions/room');

const debug = require('debug')('mud:core:bus:event:spawn-enemies-events');

const SPAWN_COOLDOWN = 60 * 1000;

/**
 * Registers two event handlers:
 *
 * 1. **'tick' event**: Spawns new enemies into eligible rooms if the spawn cooldown has passed
 *    and the current number of enemies is below the room's max.
 *    - Selects a random enemy type from the room's `spawns`.
 *    - Sends an announcement to the room.
 *
 * 2. **'enemy.died' event**: Handles loot drop and XP gain upon an enemy’s death.
 *    - Drops items from the enemy's loot table with a chance roll.
 *    - Emits a `player.xp.gain` event to award XP to the attacker.
 *    - Deletes the enemy from the repository.
 *
 * @returns {void}
 */
function register_enemy_events() {
  const { enemyRepository, roomRepository, itemRepository } = require('../repository/repositories').get();
  const { eventBus } = require('./event-bus').get();

  /**
   * Handles the `tick` event to check and refresh stores.
   *
   * @param {import('./event-types').TickEvent} param0
   */
  eventBus.on('tick', ({ now }) => {
    for (const room of roomRepository.values()) {
      if (!room.lastSpawnedAt || now - room.lastSpawnedAt >= SPAWN_COOLDOWN) {
        const enemies = enemyRepository.find_by_room(room.id);
        if (enemies.length < room.maxEnemies) {
          const spawnId = _.sample(room.spawns);

          const enemyTemplate = enemyRepository.get_template(spawnId);
          const enemy = create_enemy(enemyTemplate, room.id);
          enemyRepository.add(enemy);

          room.lastSpawnedAt = now;

          send_to_roomId(room.id, `${redBold(enemy.name)} enters the room!`);
          debug(`Spawned enemy '${enemy.name}' in room '${room.name}' ${room.id}`);
        }
      }
    }
  });

  /**
   * Handles the `tick` event to check and refresh stores.
   *
   * @param {import('./event-types').EnemyDiedEvent} param0
   */
  eventBus.on('enemy.died', ({ attacker, enemy }) => {
    send_to_room(enemy, `${cyanBold(enemy.name)} has been defeated by ${redBold(attacker.name)}!`);

    enemy.loot?.forEach((loot) => {
      if (_.random(0, 99) < loot.chance) {
        const item = itemRepository.get(loot.itemId);
        add_item(enemy.room, item);
        send_to_room(enemy.room, cyan(`${item.name} drops to the ground.`));
      }
    });

    eventBus.emit('player.xp.gain', { player: attacker, amount: enemy.experience });
    enemyRepository.delete(enemy.id);
  });
}

module.exports = {
  register_enemy_events,
};
