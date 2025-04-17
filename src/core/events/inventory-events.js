'use strict';

/**
 * @module systems/player-events
 *
 * Handles lifecycle events related to players such as entering the realm,
 * logging in, or leaving the world.
 */

const { send } = require('../functions/player');

/**
 * Registers player-related event listeners onto the global event bus.
 */
const register_inventory_events = () => {
  const { eventBus } = require('../game-bus').get();

  eventBus.on('player.item.picked_up', ({ player, item, source }) => {
    send(player, `You received ${item.name} from ${source}.`);
  });
};

module.exports = { register_inventory_events };
