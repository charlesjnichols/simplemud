/**
 * @module bus/game-bus
 *
 * Provides a wrapper around EventEmitter to create a centralized event bus
 * for game-related events such as combat ticks, player actions, or system events.
 */
const registerEvent = require('./register-events');
const create_event_bus = require('./create-event-bus');

module.exports = { ...registerEvent, create_event_bus };
