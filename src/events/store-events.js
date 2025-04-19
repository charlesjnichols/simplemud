/**
 * @module src/events/store-events.js
 *
 * Handles automatic store refresh behavior and player purchases.
 *
 * @typedef {import('../models/store').Store} Store
 * @typedef {import('../models/item').Item} Item
 * @typedef {import('../models/player').Player} Player
 *
 * @property {number} now - The current timestamp in milliseconds
 *
 * @property {Player} player - The player buying the item.
 * @property {Item} item - The item being purchased.
 */

'use strict';

const _ = require('lodash');
const debug = require('debug')('mud:store-events');

const { create_item } = require('../functions/item/create-item');
const { pickUpItem } = require('../functions/player');
const { send_to_room } = require('../functions/world');
const { cyanBold } = require('../utils/formatting');

const { STORE, SYSTEM } = require('./event-types');

/**
 * Registers store-related listeners on the global event bus.
 *
 * Handlers:
 * - `'tick'`: Refreshes store inventory if the refresh interval has passed.
 * - `'store.purchase'`: Deducts player money and adds the item to their inventory.
 *
 * Emits:
 * - `'store.refreshed'`: When a store's inventory is updated.
 *
 * @returns {void}
 */
const register_store_events = () => {
  const { eventBus } = require('./event-bus').get();
  const { storeRepository, itemRepository } = require('../repository/repositories').get();

  /**
   * Handles the `tick` event to check and refresh stores.
   *
   * @param {import('./event-types').TickEvent} param0
   */
  eventBus.on(SYSTEM.TICK, ({ now }) => {
    for (const store of storeRepository.values()) {
      const needsRefresh = now - store.last_refreshed >= store.refresh_interval;

      if (!needsRefresh) continue;

      debug(`Refreshing store '${store.id}'...`);

      const newInventory = _.sampleSize(store.items, store.itemsToOffer);
      store.inventory = newInventory.map((id) => {
        const template = itemRepository.get(id);
        const item = create_item(template);
        debug(` - Added '${item.name}' to '${store.id}'`);
        return item;
      });

      store.last_refreshed = now;

      eventBus.emit(STORE.REFRESHED, { store: store.id });
      debug(`Store '${store.id}' refreshed with ${store.inventory.length} items.`);
    }
  });

  /**
   * Handles a store purchase event.
   *
   * @param {import('./event-types').StorePurchaseEvent} param0
   */
  eventBus.on(STORE.PURCHASED, ({ player, item }) => {
    player.money -= item.price;
    pickUpItem(player, item);

    send_to_room(player, cyanBold(`${player.name} buys a ${item.name}`));
  });
};

module.exports = { register_store_events };
