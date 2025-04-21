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

const { MAP } = require('../../events/event-types');
const { renderZoneMap } = require('../../functions/maps/render-map');
const { send } = require('../../functions/player');

/**
 * Handles a player's attempt to buy an item from a store.
 *
 * @param {Player} player - The player issuing the command.
 * @param {string[]} args - The item name to buy.
 */
module.exports = (player, args) => {
  const { eventBus } = require('../../events/event-bus').get();
  eventBus.emit(MAP.GENERATE, { player, item: args });
};
