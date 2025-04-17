'use strict';

/**
 * @module systems/player-events
 *
 * Handles lifecycle events related to players such as entering the realm,
 * logging in, or leaving the world.
 */

const error = require('debug')('mud:player:player-events');

const { send_to, send_announcement, send_to_room } = require('../../functions/world');
const { cyan, yellowBold, redBold, cyanBold } = require('../../../utils/formatting');
const { send } = require('../../functions/player');

/**
 * Registers player-related event listeners onto the global event bus.
 */
const register_player_events = () => {
  const { eventBus } = require('../../game-bus').get();
  const { connectionRepository, roomRepository } = require('../../datastores').get();

  eventBus.on('player.enteredRealm', ({ player }) => {
    const connection = connectionRepository.getConnection(player.id);
    if (!connection) {
      error('%s has no connection', player.id);
      return;
    }
    send_announcement(cyan(`${player.name} appears in the realm.`));
    eventBus.emit('player.enteredRoom', { player, to: player.room });
  });

  eventBus.on('player.leftRealm', ({ player }) => {
    send_to(player, yellowBold(`${player.name} vanishes into the void.`));
  });

  eventBus.on('player.login.success', ({ player }) => {
    send_to(player, yellowBold(`${player.name} has entered the realm.`));
  });

  eventBus.on('player.move', ({ player, direction, from, to, enteredFrom }) => {
    const nextRoom = roomRepository.get(to);
    if (!nextRoom) return;

    // Update player room
    player.room = to;

    // Remove from current room
    eventBus.emit('player.leftRoom', { player, from, direction });
    eventBus.emit('player.enteredRoom', { player, to, direction, enteredFrom });
  });

  eventBus.on('player.died', ({ player, attacker }) => {
    send_to_room(player, `${cyanBold(player.name)} has been defeated by ${redBold(attacker.name)}!`);

    player.setHitPoints(Math.floor(player.maxHp * 0.7));
    player.room = 1;

    send(player, yellowBold(`You have died, but have been ressurected`));
    eventBus.emit('player.enteredRoom', { player, to: player.room });
  });
};

module.exports = { register_player_events };
