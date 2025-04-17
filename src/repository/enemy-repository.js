/**
 * @module repository/enemy-repository
 *
 * Provides in-memory caching for enemy instances and templates.
 * Supports room-based enemy lookup and loading enemy templates from disk.
 *
 * @typedef {import('../models/enemy').Enemy} Enemy
 */

'use strict';

const _ = require('lodash');
const debug = require('debug');
const log = debug('db:enemy');
const error = debug('db:enemy:error');

const path = require('path');
const jsonfile = require('jsonfile');
const { create_entity_cache } = require('../systems/create-entity-cache');

const fileTemplate = path.join(process.cwd(), 'data', 'enemies.json');

/**
 * Creates an enemy store with runtime instance caching and template loading support.
 *
 * @returns {{
 *   values: () => Enemy[],
 *   delete: (id: string) => void,
 *   add: (enemy: Enemy) => void,
 *   get: (id: string) => Enemy,
 *   get_template: (id: string) => Enemy,
 *   has: (id: string) => boolean,
 *   find_by_full_name: (name: string, filter?: (enemy: Enemy) => boolean) => Enemy | null,
 *   load_templates: () => void,
 *   find_by_room: (roomId: string, excludeId?: string | null) => Enemy[]
 * }} The enemy store interface
 */
function create_enemy_store() {
  const enemyTemplateCache = create_entity_cache(); // enemy base templates
  const enemyCache = create_entity_cache(); // active enemy instances

  /**
   * Loads enemy templates from disk and populates the template cache.
   * Terminates the process if reading/parsing fails.
   */
  const load_templates = () => {
    try {
      log('Loading enemy templates from %s', fileTemplate);
      const dataArray = jsonfile.readFileSync(fileTemplate);
      dataArray.forEach((/** @type {Partial<Enemy>} */ data) => {
        enemyTemplateCache.add(data);
      });
      log(`Loaded ${dataArray.length} enemy templates.`);
    } catch (err) {
      error(`Failed to load enemy templates`, err);
      process.exit(1);
    }
  };

  const get_template = (/** @type {string} */ id) => enemyTemplateCache.get(id);

  /**
   * Finds all active enemies in the specified room.
   *
   * @param {string} roomId - The ID of the room to search
   * @param {string | null} [excludeId=null] - Optional enemy ID to exclude
   * @returns {Enemy[]} List of matching enemies
   */
  const find_by_room = (roomId, excludeId = null) => {
    return enemyCache.values().filter((e) => e.room === roomId && e.id !== excludeId);
  };

  return {
    ..._.pick(enemyCache, ['add', 'values', 'get', 'find_by_full_name', 'has', 'delete']),
    load_templates,
    get_template,
    find_by_room,
  };
}

module.exports = {
  create_enemy_store,
};
