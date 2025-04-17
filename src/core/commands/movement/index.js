/**
 * @module commands/movement-handler-factory
 *
 * Factory that returns a movement command function for a given direction.
 * The returned function validates movement, emits a `player.move` event,
 * and notifies the current room if movement is blocked.
 *
 * @typedef {import('../../../models/player').Player} Player
 * @typedef {import('../../../models/room').Room} Room
 */

'use strict';

const { send_to_room } = require('../../functions/world');
const { red } = require('../../../utils/formatting');

/**
 * Maps each direction to its opposite, used in event context.
 * @type {Record<string, string>}
 */
const oppositeDirections = {
  north: 'south',
  south: 'north',
  east: 'west',
  west: 'east',
  up: 'down',
  down: 'up',
};

/**
 * Creates a movement command handler for a specific direction.
 *
 * @param {string} direction - The lowercase direction name (e.g., "north").
 * @returns {(player: Player) => void} A function that processes player movement in that direction.
 */
module.exports = (direction) => {
  const { roomRepository } = require('../../datastores').get();
  const { eventBus } = require('../../game-bus').get();

  /**
   * Executes the movement for the given player.
   * Emits `player.move` event if valid, or notifies room if blocked.
   *
   * @param {Player} player - The player attempting to move.
   */
  return (player) => {
    const room = roomRepository.get(player.room);
    const from = player.room;
    const to = room.rooms[direction.toUpperCase()];

    if (!to) {
      send_to_room(player, red(`${player.name} bumps into the wall to the ${direction}!!!`));
      return;
    }

    eventBus.emit('player.move', {
      player,
      direction,
      from,
      to,
      enteredFrom: oppositeDirections[direction],
    });
  };
};
