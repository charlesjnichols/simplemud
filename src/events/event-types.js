/**
 * @file src/events/event-types.js
 *
 * Shared typedefs for event payloads used across the game event bus.
 */

/**
 * @typedef {import('../models/player').Player} Player
 * @typedef {import('../models/enemy').Enemy} Enemy
 * @typedef {import('../models/item').Item} Item
 * @typedef {import('../models/store').Store} Store
 * @typedef {import('../models/room').Room} Room
 */

/**
 * @typedef {Object} TickEvent
 * @property {number} now - The current timestamp in milliseconds
 */

/**
 * @typedef {Object} PlayerEvent
 * @property {Player} player - The player involved in the event
 */

/**
 * @typedef {Object} PlayerMoveEvent
 * @property {Player} player - The player who moved
 * @property {string} from - The room ID the player came from
 * @property {string} to - The room ID the player moved to
 * @property {string} direction - The direction the player moved
 * @property {string} enteredFrom - The reverse direction (into the new room)
 */

/**
 * @typedef {Object} PlayerDiedEvent
 * @property {Player} player - The player who died
 * @property {Player|Enemy} attacker - The entity responsible for the player's death
 */

/**
 * @typedef {Object} PlayerXPGainEvent
 * @property {Player} player - The player gaining XP
 * @property {number} amount - The XP amount gained
 */

/**
 * @typedef {Object} StorePurchaseEvent
 * @property {Player} player - The player making the purchase
 * @property {Item} item - The item being purchased
 */

/**
 * @typedef {Object} EnemyDiedEvent
 * @property {Player|Enemy} attacker - The entity that killed the enemy
 * @property {Enemy} enemy - The enemy that died
 */

/**
 * @typedef {Object} ItemPickupEvent
 * @property {Player} player - The player who picked up the item
 * @property {Item} item - The item picked up
 * @property {Room} room - The room
 * @property {string} source - The source of the item (e.g., "enemy", "chest")
 */

/**
 * @typedef {Object} StoreRefreshedEvent
 * @property {string} store - The ID of the store that was refreshed
 */
module.exports = {};
