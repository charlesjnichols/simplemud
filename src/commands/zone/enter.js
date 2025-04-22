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

const error = require('debug')('mud:commands:zone:enter:error');
const { PLAYER } = require('../../events/event-types');
const { send } = require('../../functions/player');

/**
 * Executes the movement for the given player.
 * Emits `player.move` event if valid, or notifies room if blocked.
 *
 * @param {Player} player - The player attempting to move.
 */
module.exports = (player) => {
  const { roomRepository, zoneRepository } = require('../../repository/repositories').get();
  const { eventBus } = require('../../events/event-bus').get();

  const room = roomRepository.get(player.room);

  if (!room || !room.zone) {
    error('cannot enter port from room %o with no zone', room);
    send(player, 'you cannot enter here');
    return;
  }
  if (!room.portal) {
    send(player, 'there is nothing to enter');
  }

  zoneRepository.delete(room.zone);
  eventBus.emit(PLAYER.MOVED, {
    player,
    to: '1',
  });
};
