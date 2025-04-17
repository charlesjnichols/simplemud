/**
 * @module repository/databases
 *
 * Initializes and loads all core game repositories:
 * - Items
 * - Players
 * - Rooms
 * - Stores
 * - Enemies
 * - Connections
 *
 * @typedef {import('../models/item').Item} Item
 * @typedef {import('../models/player').Player} Player
 * @typedef {import('../models/room').Room} Room
 * @typedef {import('../models/store').Store} Store
 * @typedef {import('../models/enemy').Enemy} Enemy
 * @typedef {import('./connection/connection')} Connection
 */

'use strict';

const debug = require('debug');
const log = debug('db:load');
const error = debug('db:error');

// Repositories
const { create_item_store } = require('./repository/item-repository');
const { create_player_store } = require('./repository/player-repository');
const { create_room_store } = require('./repository/room-repository');
const { create_store_store } = require('./repository/store-repository');
const { create_enemy_store } = require('./repository/enemy-repository');
const { create_connection_cache } = require('./repository/connection-repository');

// Create instances
const itemRepository = create_item_store();
const playerRepository = create_player_store();
const roomRepository = create_room_store();
const storeRepository = create_store_store();
const enemyRepository = create_enemy_store();
const connectionRepository = create_connection_cache();

/**
 * Loads all static and template-based repositories at startup.
 * Exits the process on failure.
 */
function load() {
  try {
    log('Loading repositories...');

    log('- items');
    itemRepository.load_all();

    log('- enemies');
    enemyRepository.load_templates();

    log('- stores');
    storeRepository.load_all();

    log('- rooms');
    roomRepository.load_templates();

    log('✅ All repositories loaded.');
  } catch (err) {
    error(`💥 Error loading repositories: ${err.message}\n${err.stack}`);
    process.exit(1);
  }
}

/**
 * Provides access to all initialized game repositories.
 *
 * @returns {{
 *   itemRepository: ReturnType<typeof create_item_store>,
 *   playerRepository: ReturnType<typeof create_player_store>,
 *   roomRepository: ReturnType<typeof create_room_store>,
 *   storeRepository: ReturnType<typeof create_store_store>,
 *   enemyRepository: ReturnType<typeof create_enemy_store>,
 *   connectionRepository: ReturnType<typeof create_connection_cache>
 * }}
 */
function get() {
  return {
    itemRepository,
    playerRepository,
    roomRepository,
    storeRepository,
    enemyRepository,
    connectionRepository,
  };
}

module.exports = { load, get };
