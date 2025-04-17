'use strict';

const _ = require('lodash');
const item_model = require('../../models/item');

/**
 * @typedef {import('../../models/item').Item} Item
 */

/**
 * Creates a new item instance by deep-cloning the item model
 * and applying the provided data overrides.
 *
 * @param {Partial<Item>} [data={}] - Partial item data to override the default model.
 * @returns {Item} A fully initialized item object.
 */
function create_item(data = {}) {
  const item = _.cloneDeep(item_model);

  // Populate with values or defaults
  Object.assign(item, data);
  return item;
}

module.exports = { create_item };
