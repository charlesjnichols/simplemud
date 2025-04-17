/**
 * @module src/events/room-events.js
 *
 * Handles player movement between rooms.
 *
 * @typedef {import('../models/player').Player} Player
 *
 * @typedef {Object} MoveEvent
 * @property {Player} player - The player who moved.
 * @property {string} from - The ID of the room the player left.
 * @property {string} to - The ID of the room the player entered.
 * @property {string} direction - The direction the player traveled.
 * @property {string} enteredFrom - The reverse direction (e.g. "south" if "north" was used).
 *
 * @typedef {Object} RoomEvent
 * @property {Player} player - The player involved in the event.
 * @property {string} from - The ID of the room they left.
 * @property {string} to - The ID of the room they entered.
 */

'use strict';

const { cyan } = require('../utils/formatting');
const { send } = require('../functions/player');
const { render_room } = require('../functions/room');
const { send_to_room, send_to_roomId } = require('../functions/world');

/**
 * Registers room-related event listeners onto the global event bus.
 *
 * Handles:
 * - `'player.leftRoom'`: Sends exit messages and updates surrounding players.
 * - `'player.enteredRoom'`: Renders the new room for the player and emits `room.entered`.
 *
 * @returns {void}
 */
const register_room_events = () => {
  const { eventBus } = require('./event-bus').get();

  /**
   * Handles when a player leaves a room.
   *
   * @param {import('./event-types').PlayerMoveEvent} param0
   */
  eventBus.on('player.leftRoom', ({ player, from, direction }) => {
    send(player, `You walk ${direction}.`);
    send_to_roomId(from, cyan(`${player.name} leaves to the ${direction}.`));
  });

  /**
   * Handles when a player enters a new room.
   *
   * @param {import('./event-types').PlayerMoveEvent} param0
   */
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
