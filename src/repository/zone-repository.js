/**
 * @module repository/zone-repository
 *
 * Provides in-memory caching and loading for store definitions.
 * Loads from a static JSON file (`data/stores.json`) and supports basic lookup.
 *
 * @typedef {import('../models/zone').Zone} Zone
 */

const _ = require('lodash');
const { create_entity_cache } = require('../systems/create-entity-cache');

/**
 * Creates a store repository that loads zone definitions into memory
 *
 * @returns {{
 *   values: () => Zone[],
 *   add: (entity: Zone) => void,
 *   delete: (id: string) => boolean,
 *   get: (id: string) => Zone | undefined
 *   has: (id: string) => boolean
 * }} The store repository interface
 */
function create_zone_store() {
  const storeCache = create_entity_cache();

  return {
    ..._.pick(storeCache, ['values', 'get', 'add', 'has', 'delete']),
  };
}

module.exports = { create_zone_store };
