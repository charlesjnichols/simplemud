/**
 * @module bus/game-bus
 *
 * Provides a wrapper around EventEmitter to create a centralized event bus
 * for game-related events such as combat ticks, player actions, or system events.
 */

const EventEmitter = require('eventemitter3');

/**
 * Creates a new game event bus with a simplified API for emitting and listening to events.
 *
 * @returns {{
 *   on: (event: string, handler: (payload: any) => void) => void,
 *   off: (event: string, handler: (payload: any) => void) => void,
 *   emit: (event: string, payload: any) => void,
 *   once: (event: string, handler: (payload: any) => void) => void,
 *   raw: () => EventEmitter
 * }} The game event bus interface.
 */
const create_event_bus = () => {
  // @ts-ignore - EventEmitter isn't typed here, but we use it safely
  const bus = new EventEmitter();

  const on = (event, handler) => bus.on(event, handler);
  const off = (event, handler) => bus.off(event, handler);
  const emit = (event, payload) => bus.emit(event, payload);
  const once = (event, handler) => bus.once(event, handler);

  /**
   * Returns the raw EventEmitter instance for advanced use.
   * @returns {EventEmitter}
   */
  const raw = () => bus;

  return {
    on,
    off,
    emit,
    once,
    raw,
  };
};

module.exports = create_event_bus;
