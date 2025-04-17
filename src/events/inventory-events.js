/**
 * @module src/events/inventory-events.js
 *
 * Handles inventory-related events such as item pickups.
 */

'use strict';

const { pickUpItem, dropItem } = require('../functions/player');
const { remove_item, add_item } = require('../functions/room');
const { send_to_room } = require('../functions/world');
const { cyanBold } = require('../utils/formatting');

/**
 * Registers inventory-related event listeners onto the global event bus.
 *
 * Currently listens for:
 * - `'player.item.picked_up'`: Sends a message to the player indicating they received an item.
 *
 * @returns {void}
 */
const register_inventory_events = () => {
  const { eventBus } = require('./event-bus').get();

  /**
   * Handles the `player.item.picked_up` event.
   *
   * @param {import('./event-types').ItemPickupEvent} param0 - Event payload containing the player, the item picked up, and the source of the item.
   */
  eventBus.on('player.item.picked_up', ({ player, item, room }) => {
    pickUpItem(player, item);
    remove_item(room, item);

    send_to_room(player, cyanBold(`${player.name} picks up ${item.name}.`));
  });

  /**
   * Handles the `player.item.picked_up` event.
   *
   * @param {import('./event-types').ItemPickupEvent} param0 - Event payload containing the player, the item picked up, and the source of the item.
   */
  eventBus.on('player.item.dropped', ({ player, item, room }) => {
    dropItem(player, item);
    add_item(room, item);

    send_to_room(player, cyanBold(`${player.name} drop up ${item.name}.`));
  });
};

module.exports = { register_inventory_events };
