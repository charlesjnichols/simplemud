/**
 * @typedef {import('./item')} Item
 */

/**
 * @typedef {Object} Store
 *
 * Persistent Properties:
 * @property {string|null} id - Unique identifier for the store.
 * @property {string|null} name - Display name of the store.
 * @property {string[]} items - List of item templates the store can offer.
 * @property {number} itemsToOffer - How many items to offer during each refresh.
 *
 * Transient (Runtime-Only) Properties:
 * @property {Item[]=} inventory - IDs of items currently available in the store.
 * @property {number=} last_refreshed - Timestamp (ms) of the last refresh.
 * @property {number=} refresh_interval - Interval (ms) between automatic store refreshes.
 */

/** @type {Store} */
module.exports = {
  id: null,
  name: null,
  items: [],
  itemsToOffer: 0,
};
