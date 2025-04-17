/**
 * @module commands/buy
 *
 * Command handler for the `buy` action.
 * Attempts to purchase an item from the store in the current room using fuzzy search.
 * Handles validation, affordability, and inventory space.
 *
 * @typedef {import('../../models/player').Player} Player
 * @typedef {import('../../models/item').Item} Item
 */

'use strict';

const Fuse = require('fuse.js');
const _ = require('lodash');

const { send } = require('../../functions/player');
const { redBold } = require('../../utils/formatting');

/**
 * @param {Player} player - The player issuing the command.
 * @param {string[]} args - The arguments passed to the command; expects item name as the first argument.
 */
module.exports = (player, [itemName]) => {
  const { eventBus } = require('../../events/event-bus').get();
  const { roomRepository, storeRepository } = require('../../repository/repositories').get();

  if (!itemName) {
    send(player, redBold('What do you want to buy.'));
    return;
  }

  const room = roomRepository.get(player.room);
  const storeId = room.store;
  if (!storeId) {
    send(player, redBold("There's no store here."));
    return;
  }

  const store = storeRepository.get(storeId);

  /** @type {Fuse<Item>} */
  // @ts-ignore
  const fuse = new Fuse(store.inventory, {
    keys: ['name'],
    threshold: 0.4,
  });

  // @ts-ignore
  const matches = fuse.search(itemName);
  if (matches.length === 0) {
    send(player, redBold("Sorry, we don't have that item!"));
    return;
  }

  if (matches.length > 1) {
    const options = matches.map((m, i) => `  ${i + 1}. ${m.item.name}`).join('\n');
    send(player, redBold('Multiple matches found:\n') + options + '\nPlease be more specific.');
    return;
  }

  const item = _.first(matches).item;

  if (!item) {
    send(player, redBold("Sorry, we don't have that item!"));
    return;
  }

  if (player.money < item.price) {
    send(player, redBold("Sorry, but you can't afford that!"));
    return;
  }

  eventBus.emit('store.purchase', { player, item, store });
};
