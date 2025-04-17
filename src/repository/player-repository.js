/**
 * @module repository/player-repository
 *
 * Provides an in-memory cache and disk persistence layer for player data.
 * Players are stored as JSON files in `data/playerRepository`.
 * Includes helper functions for lookup, mutation, and filtering.
 *
 * @typedef {import('../models/player').Player} Player
 */

'use strict';

const _ = require('lodash');
const debug = require('debug');
const log = debug('db:player');
const error = debug('db:player:error');

const path = require('path');
const jsonfile = require('jsonfile');

const { create_entity_cache } = require('../systems/create-entity-cache');
const { create_player } = require('../functions/player/create-player');
const { serialize_player } = require('../functions/player/serialize-player');

const PLAYER_DIR = path.resolve(process.cwd(), 'data/players');

/**
 * Creates a repository for managing player state, in-memory and on-disk.
 *
 * @returns {{
 *   save: (id: string) => void,
 *   save_all: () => boolean,
 *   load_by_name: (name: string) => Player|null,
 *   add: (player: Player) => boolean,
 *   delete: (id: string) => void,
 *   find_by: (excludeId?: string|null) => Player[],
 *   find_by_room: (roomId: string, excludeId?: string|null) => Player[],
 *   find_by_full_name: (name: string) => Player|null,
 *   get: (id: string) => Player,
 *   keys: () => IterableIterator<string>,
 *   values: () => Player[],
 * }} The player repository interface.
 */
function create_player_store() {
  const playerCache = create_entity_cache();

  const save_all = () => {
    log('Saving all playerRepository...');
    playerCache.values().forEach((player) => save(player.id));
    log('Saved all playerRepository to individual files.');
    return true;
  };

  const save = (id) => {
    const player = playerCache.get(id);
    const file = path.join(PLAYER_DIR, `${player.name}.json`);

    log(`writing player file ${file}`);
    const safe = serialize_player(player);
    jsonfile.writeFileSync(file, safe, { spaces: 2 });
    log(`Saved player '${player.id}': '${player.name}' to ${file}`);
  };

  const load_by_name = (name) => {
    const file = path.join(PLAYER_DIR, `${name}.json`);
    try {
      log(`reading player file ${file}`);
      const player = create_player(jsonfile.readFileSync(file));
      return player;
    } catch (err) {
      error(`Failed to load player '${file}': ${err.message}`);
      return null;
    }
  };

  const add = (player) => {
    if (playerCache.has(player.id) || playerCache.has_full_name(player.name)) return false;
    playerCache.add(player);
    save(player.id);
    return true;
  };

  const find_by_room = (roomId, excludeId = null) => {
    return playerCache.values().filter((p) => p.room === roomId && p.id !== excludeId);
  };

  return {
    save,
    save_all,
    load_by_name,
    add,
    find_by_room,
    ..._.pick(playerCache, ['delete', 'find_by', 'find_by_full_name', 'get', 'keys', 'values']),
  };
}

module.exports = { create_player_store };
