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

const fuzzysort = require('fuzzysort');
const error = require('debug')('mud:commands:store:buy:error');

const { send } = require('../../functions/player');
const { redBold } = require('../../utils/formatting');
const { STORE } = require('../../events/event-types');

/**
 * Handles a player's attempt to buy an item from a store.
 *
 * @param {Player} player - The player issuing the command.
 * @param {string[]} args - The item name to buy.
 */
module.exports = (player, [itemName]) => {
  const { eventBus } = require('../../events/event-bus').get();
  const { roomRepository, storeRepository } = require('../../repository/repositories').get();

  if (!itemName) {
    send(player, redBold('What do you want to buy?'));
    return;
  }

  const room = roomRepository.get(player.room);
  if (!room || !room.store) {
    error('No store in room for player %O', player);
    send(player, redBold("There's no store here."));
    return;
  }

  const store = storeRepository.get(room.store);
  if (!store) {
    error('Store not found: room.store=%s player=%O', room.store, player);
    send(player, redBold('The store appears to be missing.'));
    return;
  }

  const matches = fuzzysort.go(itemName, store.inventory, {
    key: 'name',
    threshold: -1000,
  });

  if (matches.length === 0) {
    send(player, redBold("Sorry, we don't have that item!"));
    return;
  }

  if (matches.length > 1) {
    const options = matches.map((m, i) => `${i + 1}. ${m.obj.name}`).join('\n');
    send(player, redBold(`Multiple matches found:\n${options}\nPlease be more specific.`));
    return;
  }

  const item = matches[0].obj;

  if (!item || typeof item.price !== 'number') {
    error('Invalid item object in store: %O', item);
    send(player, redBold("That item isn't valid."));
    return;
  }

  if (player.money < item.price) {
    send(player, redBold("Sorry, but you can't afford that!"));
    return;
  }

  eventBus.emit(STORE.PURCHASED, { player, item, store });
};
