/**
 * @module commands/buy
 *
 * Command handler for the `buy` action.
 * Uses fuzzy search to match an item in the room's store,
 * checks affordability, and emits a purchase event.
 *
 * @typedef {import('../../models/player').Player} Player
 * @typedef {import('../../models/item').Item} Item
 */

'use strict';

const error = require('debug')('mud:commands:map:error');

const { render_zone_map } = require('../../functions/zone');
const { send } = require('../../functions/player');

/**
 * Handles a player's attempt to buy an item from a store.
 *
 * @param {Player} player - The player issuing the command.
 */
module.exports = (player) => {
  const { roomRepository, zoneRepository } = require('../../repository/repositories').get();
  const room = roomRepository.get(player.room);

  if (!room) {
    error('player not in room %O', player);
    return;
  }

  if (!room.zone) {
    send(player, 'you are not in a map');
    return;
  }

  const zone = zoneRepository.get(room.zone);
  if (!zone) {
    error('player not in stored zone %O', player);
    return;
  }

  send(player, render_zone_map(zone.rooms, player, player.exploredRooms).join('\r\n'));
};
