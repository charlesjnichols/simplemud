'use strict';

/**
 * @module systems/store-events
 *
 * Handles automatic store refresh behavior on tick events.
 *
 * @typedef {import('../models/store').Store} Store
 * @typedef {import('../models/item').Item} Item
 * @typedef {Object} TickEvent
 * @property {number} now - The current timestamp in milliseconds
 */

const _ = require('lodash');
const debug = require('debug')('mud:store-events');

const { create_item } = require('../functions/item/create-item');
const { pickUpItem } = require('../functions/player');
const { send_to_room } = require('../functions/world');
const { cyanBold } = require('../../utils/formatting');

/**
 * Registers store-related listeners on the global event bus.
 * Handles store.inventory rotation based on store.refresh_interval.
 *
 * Emits:
 * - `store.refreshed`: When a store's inventory is updated.
 */
const register_store_events = () => {
  const { eventBus } = require('../game-bus').get();
  const { storeRepository, itemRepository } = require('../datastores').get();

  eventBus.on('tick', ({ now }) => {
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

      eventBus.emit('store.refreshed', { store: store.id });
      debug(`Store '${store.id}' refreshed with ${store.inventory.length} items.`);
    }
  });

  eventBus.on('store.purchase', ({ player, item }) => {
    player.money -= item.price;
    pickUpItem(player, item);

    send_to_room(player, cyanBold(`${player.name} buys a ${item.name}`));
  });
};

module.exports = { register_store_events };
