/**
 * @module repository/item-repository
 *
 * Provides in-memory caching and loading logic for items.
 * Items are loaded from a static JSON file and cached for lookup.
 *
 * @typedef {import('../models/item').Item} Item
 */

'use strict';

const _ = require('lodash');
const path = require('path');
const jsonfile = require('jsonfile');
const debug = require('debug');

const log = debug('db:item');
const error = debug('db:item:error');

const { create_entity_cache } = require('../systems/create-entity-cache');
const { create_item } = require('../functions/item/create-item');

const filePath = path.join(process.cwd(), 'data', 'items.json');

/**
 * Creates an item store with in-memory cache and JSON-based loading support.
 *
 * @returns {{
 *   load_all: () => void,
 *   values: () => Item[],
 *   get: (id: string) => Item | undefined
 * }} The item repository interface.
 */
function create_item_store() {
  const itemCache = create_entity_cache();

  /**
   * Loads all items from disk and populates the in-memory cache.
   * Clears existing cache before loading.
   */
  function load_all() {
    try {
      itemCache.clear();
      log('Loading item database from %s...', filePath);

      const dataArray = jsonfile.readFileSync(filePath);
      dataArray.forEach((data) => {
        const item = create_item(data);
        itemCache.add(item);
      });

      log(`Loaded %d items.`, itemCache.size());
    } catch (err) {
      error(`Failed to load item database: %O`, err);
    }
  }

  return {
    load_all,
    ..._.pick(itemCache, ['values', 'get']),
  };
}

module.exports = { create_item_store };
