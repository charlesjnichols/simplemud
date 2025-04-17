/**
 * @module repository/room-repository
 *
 * Provides in-memory caching and JSON-based loading of room templates.
 *
 * @typedef {import('../models/room').Room} Room
 */

'use strict';

const _ = require('lodash');
const debug = require('debug');
const log = debug('db:room');
const error = debug('db:room:error');

const path = require('path');
const jsonfile = require('jsonfile');

const { create_room } = require('../functions/room/create-room');
const { create_entity_cache } = require('../systems/create-entity-cache');

const fileMap = path.join(process.cwd(), 'data', 'map.json');

/**
 * Creates a room store with template loading and lookup functionality.
 *
 * @returns {{
 *   load_templates: () => void,
 *   values: () => Room[],
 *   get: (id: string) => Room | undefined
 * }} The room store interface
 */
function create_room_store() {
  const roomCache = create_entity_cache();

  /**
   * Loads room definitions from `data/map.json` and caches them.
   * Clears the cache before loading.
   * Terminates the process if file loading fails.
   */
  function load_templates() {
    try {
      roomCache.clear();

      log('Loading room templates from %s', fileMap);
      const dataArray = jsonfile.readFileSync(fileMap);
      dataArray.forEach((data) => {
        roomCache.add(create_room(data));
      });
      log(`Loaded ${roomCache.size()} room.`);
    } catch (err) {
      error(`Failed to load room templates: ${err.message}`, err);
      process.exit(1);
    }
  }

  return {
    ..._.pick(roomCache, ['values', 'get']),
    load_templates,
  };
}

module.exports = { create_room_store };
