/**
 * @module repository/store-repository
 *
 * Provides in-memory caching and loading for store definitions.
 * Loads from a static JSON file (`data/stores.json`) and supports basic lookup.
 *
 * @typedef {import('../models/store').Store} Store
 */

'use strict';

const _ = require('lodash');
const path = require('path');
const jsonfile = require('jsonfile');
const debug = require('debug');
const log = debug('db:store');
const error = debug('db:store:error');

const { create_store } = require('../functions/store/create-store');
const { create_entity_cache } = require('./cache');

const file = path.join(process.cwd(), 'data', 'stores.json');

/**
 * Creates a store repository that loads store definitions into memory
 * and provides access via `.values()` and `.get(id)`.
 *
 * @returns {{
 *   load_all: () => void,
 *   values: () => Store[],
 *   get: (id: string) => Store | undefined
 * }} The store repository interface
 */
function create_store_store() {
  const storeCache = create_entity_cache();

  /**
   * Loads all stores from disk and populates the store cache.
   * Clears any previous data before loading.
   * Logs activity using debug.
   */
  function load_all() {
    try {
      storeCache.clear();
      log('Loading store definitions from %s', file);

      const dataArray = jsonfile.readFileSync(file);
      dataArray.forEach((data) => {
        const store = create_store(data);
        storeCache.add(store);
      });

      log(`Loaded ${storeCache.size()} store(s).`);
    } catch (err) {
      error(`Failed to load store data: ${err.message}`);
    }
  }

  return {
    ..._.pick(storeCache, ['values', 'get']),
    load_all,
  };
}

module.exports = { create_store_store };
