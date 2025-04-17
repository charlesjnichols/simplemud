/**
 * @module src/events/inventory-events.js
 *
 * Handles inventory-related events such as item pickups.
 */

'use strict';

const { send } = require('../functions/player');
const { cyan } = require('../utils/formatting');

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
  eventBus.on('player.item.picked_up', ({ player, item, source }) => {
    send(player, `You received ${cyan(item.name)} from ${cyan(source)}.`);
  });
};

module.exports = { register_inventory_events };
