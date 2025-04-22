/**
 * @module commands/movement-handler-factory
 *
 * Factory that returns a movement command function for a given direction.
 * The returned function validates movement, emits a `player.move` event,
 * and notifies the current room if movement is blocked.
 *
 * @typedef {import('../../models/player').Player} Player
 * @typedef {import('../../models/room').Room} Room
 */

'use strict';

const { ZONE } = require('../../events/event-types');
const { send_to_room } = require('../../functions/world');
const { red } = require('../../utils/formatting');

/**
 * Executes the movement for the given player.
 * Emits `player.move` event if valid, or notifies room if blocked.
 *
 * @param {Player} player - The player attempting to move.
 */
module.exports = (player) => {
  const { roomRepository } = require('../../repository/repositories').get();
  const { eventBus } = require('../../events/event-bus').get();

  const room = roomRepository.get(player.room);
  if (!room || !room.zone) {
    send_to_room(player, red(`You can't open a portal here.`));
    return;
  }

  eventBus.emit(ZONE.PORTAL_OPENED, { player, room });
};
