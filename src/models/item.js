const { ItemType } = require('../config');

/**
 * @typedef {Object} Item
 *
 * @property {string} name - Display name of the item.
 * @property {string} type - Type/category of the item (e.g. 'weapon', 'armor').
 * @property {string} id - Unique identifier for the item template.
 * @property {number} min - Minimum damage or effect value.
 * @property {number} max - Maximum damage or effect value.
 * @property {number} speed - Attack speed or use rate (0 = instant or baseline).
 * @property {number} price - Value of the item in in-game currency.
 */

/** @type {Item} */
module.exports = {
  id: '',
  name: '',
  type: ItemType.WEAPON,
  min: 0,
  max: 0,
  speed: 0,
  price: 0,
};
