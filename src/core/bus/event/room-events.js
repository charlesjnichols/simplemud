'use strict';

const { cyan } = require('../../../utils/formatting');
const { send } = require('../../functions/player');
const { render_room } = require('../../functions/room');
const { send_to_room, send_to_roomId } = require('../../functions/world');

/**
 * @module systems/room-events
 *
 * Handles player movement between rooms.
 *
 * @typedef {import('../../../models/player').Player} Player
 *
 * @typedef {Object} MoveEvent
 * @property {Player} player
 * @property {string} from
 * @property {string} to
 * @property {string} direction
 * @property {string} enteredFrom
 *
 * @typedef {Object} RoomEvent
 * @property {Player} player
 * @property {string} from | to
 */
const register_room_events = () => {
  const { eventBus } = require('../../game-bus').get();

  eventBus.on('player.leftRoom', ({ player, from, direction }) => {
    send(player, `You walk ${direction}.`);
    send_to_roomId(from, cyan(`${player.name} leaves to the ${direction}.`));
  });

  eventBus.on('player.enteredRoom', ({ player, to, enteredFrom }) => {
    send(player, render_room(to));
    if (enteredFrom) {
      send_to_room(player, cyan(`${player.name} enters from the ${enteredFrom}.`));
    } else {
      send_to_room(player, cyan(`${player.name} appears from the void`));
    }
    eventBus.emit('room.entered', { player, to });
  });
};

module.exports = {
  register_room_events,
};
