/**
 * @module repository/mob-repository
 *
 * Provides in-memory caching for mob instances and templates.
 * Supports room-based mob lookup and loading mob templates from disk.
 *
 * @typedef {import('../models/mob').Mob} mob
 */

'use strict';

const _ = require('lodash');
const debug = require('debug');
const log = debug('db:mob');
const error = debug('db:mob:error');

const path = require('path');
const jsonfile = require('jsonfile');
const { create_entity_cache } = require('../systems/create-entity-cache');

const fileTemplate = path.join(process.cwd(), 'data', 'mobs.json');

/**
 * Creates an mob store with runtime instance caching and template loading support.
 *
 * @returns {{
 *   values: () => mob[],
 *   delete: (id: string) => void,
 *   add: (mob: mob) => void,
 *   get: (id: string) => mob,
 *   get_template: (id: string) => mob,
 *   has: (id: string) => boolean,
 *   find_by_full_name: (name: string, filter?: (mob: mob) => boolean) => mob | null,
 *   load_templates: () => void,
 *   find_by_room: (roomId: string, excludeId?: string | null) => mob[]
 * }} The mob store interface
 */
function create_mob_store() {
  const mobTemplateCache = create_entity_cache(); // mob base templates
  const mobCache = create_entity_cache(); // active mob instances

  /**
   * Loads mob templates from disk and populates the template cache.
   * Terminates the process if reading/parsing fails.
   */
  const load_templates = () => {
    try {
      log('Loading mob templates from %s', fileTemplate);
      const dataArray = jsonfile.readFileSync(fileTemplate);
      dataArray.forEach((/** @type {Partial<mob>} */ data) => {
        mobTemplateCache.add(data);
      });
      log(`Loaded ${dataArray.length} mob templates.`);
    } catch (err) {
      error(`Failed to load mob templates`, err);
      process.exit(1);
    }
  };

  const get_template = (/** @type {string} */ id) => mobTemplateCache.get(id);

  /**
   * Finds all active mobs in the specified room.
   *
   * @param {string} roomId - The ID of the room to search
   * @param {string | null} [excludeId=null] - Optional mob ID to exclude
   * @returns {mob[]} List of matching mobs
   */
  const find_by_room = (roomId, excludeId = null) => {
    return mobCache.values().filter((e) => e.room === roomId && e.id !== excludeId);
  };

  return {
    ..._.pick(mobCache, ['add', 'values', 'get', 'find_by_full_name', 'has', 'delete']),
    load_templates,
    get_template,
    find_by_room,
  };
}

module.exports = {
  create_mob_store,
};
