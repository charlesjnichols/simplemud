/**
 * @module systems/enemy-spawn-events
 *
 * Spawns enemies into eligible rooms during the game tick.
 *
 * @typedef {import('../../models/room').Room} Room
 * @typedef {import('../../models/enemy').Enemy} Enemy
 * @typedef {import('../../models/player').Player} Player
 */

'use strict';

const _ = require('lodash');

const { redBold, cyan, cyanBold } = require('../../../utils/formatting');
const { create_enemy } = require('../../functions/enemy/create-enemy');
const { send_to_roomId, send_to_room } = require('../../functions/world');
const { add_item } = require('../../functions/room');
const { send } = require('../../functions/player');

const debug = require('debug')('mud:core:bus:event:spawn-enemies-events');

const SPAWN_COOLDOWN = 60 * 1000;

/**
 * Registers enemy spawn logic on tick.
 *
 */
function register_enemy_events() {
  const { enemyRepository, roomRepository, itemRepository } = require('../../datastores').get();
  const { eventBus } = require('../../game-bus').get();

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

  eventBus.on('enemy.died', ({ attacker, enemy }) => {
    send_to_room(enemy, `${cyanBold(enemy.name)} has been defeated by ${redBold(attacker.name)}!`);

    enemy.loot?.forEach((loot) => {
      if (_.random(0, 99) < loot.chance) {
        const item = itemRepository.get(loot.itemId);
        add_item(enemy.room, item);
        send_to_room(enemy.room, cyan(`${item.name} drops to the ground.`));
      }
    });

    attacker.experience += enemy.experience;
    send(attacker, cyanBold(`You gain ${enemy.experience} experience.`));
    enemyRepository.delete(enemy.id);
  });
}

module.exports = {
  register_enemy_events,
};
