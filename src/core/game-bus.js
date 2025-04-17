/**
 * @module core/event-bus
 *
 * Central registry for the global event bus.
 * Provides a singleton interface to initialize and access the bus instance
 * for subscribing to and emitting global game events.
 *
 * Registers all system event listeners during initialization.
 */

'use strict';

const { create_event_bus } = require('./bus');
const registerEvents = require('./events');

/**
 * Internal state holder for the singleton event bus.
 * @type {{ eventBus: ReturnType<typeof create_event_bus> | null }}
 */
const state = { eventBus: null };

/**
 * Initializes the global event bus.
 *
 * This should be called **once** during the application bootstrap process
 * (e.g., in `server.js`). It sets up the EventEmitter-based bus instance
 * used for all game event communication across systems.
 *
 * @throws {Error} If called more than once.
 * @returns {ReturnType<typeof create_event_bus>} The initialized event bus instance.
 */
const init = () => {
  if (state.eventBus) {
    throw new Error('[event-bus] Bus already initialized.');
  }

  state.eventBus = create_event_bus();
  registerEvents();
  return state.eventBus;
};

/**
 * Retrieves the current event bus instance.
 *
 * Automatically registers system event listeners.
 * Will throw if the bus has not been initialized yet.
 *
 * @throws {Error} If the event bus hasn't been initialized.
 * @returns {{ eventBus: ReturnType<typeof create_event_bus> }} An object containing the active event bus.
 */
const get = () => {
  if (!state.eventBus) {
    throw new Error('[event-bus] Bus not initialized. Call init() first.');
  }
  return { eventBus: state.eventBus };
};

module.exports = {
  init,
  get,
};
