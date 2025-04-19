/**
 * @typedef {import('../models/player').Player} Player
 * @typedef {import('../models/mob').Mob} Mob
 * @typedef {import('../models/item').Item} Item
 * @typedef {import('../models/store').Store} Store
 * @typedef {import('../models/room').Room} Room
 */

/**
 * @typedef {Object} mobDiedEvent
 * @property {Player|Mob} attacker
 * @property {Mob} mob
 */

/** @typedef {Object} TickEvent
 *  @property {number} now
 */

/** @typedef {Object} PlayerEvent
 *  @property {Player} player
 */

/** @typedef {Object} PlayerMoveEvent
 *  @property {Player} player
 *  @property {string} from
 *  @property {string} to
 *  @property {string} direction
 *  @property {string} enteredFrom
 */

/** @typedef {Object} PlayerDiedEvent
 *  @property {Player} player
 *  @property {Player|Mob} attacker
 */

/** @typedef {Object} PlayerXPGainEvent
 *  @property {Player} player
 *  @property {number} amount
 */

/** @typedef {Object} StorePurchaseEvent
 *  @property {Player} player
 *  @property {Item} item
 */

/** @typedef {Object} ItemPickupEvent
 *  @property {Player} player
 *  @property {Item} item
 *  @property {Room} room
 *  @property {string} source
 */

/** @typedef {Object} StoreRefreshedEvent
 *  @property {string} store
 */

// empty export to allow importing types
module.exports = {};
