'use strict';

const createItemDatabase = require('./item/database');
const createPlayerDatabase = require('./player/database');
const createRoomDatabase = require('./room/database');
const createStoreDatabase = require('./store/database');
const { createEnemyTemplateDatabase, createEnemyDatabase } = require('./enemy/database');

// Instantiate all databases
const itemDb = createItemDatabase();
const playerDb = createPlayerDatabase();
const roomDb = createRoomDatabase();
const storeDb = createStoreDatabase();
const enemyTpDb = createEnemyTemplateDatabase();
const enemyDb = createEnemyDatabase();

/**
 * Loads all game databases in proper dependency order.
 */
const loadDatabases = () => {
  try {
    console.log('[DB] Loading databases...');
    itemDb.load();
    enemyTpDb.load();
    enemyDb.load();
    storeDb.load({ itemDb });
    roomDb.loadTemplates({ storeDb });
    roomDb.loadData({ itemDb });
    playerDb.load({ itemDb, roomDb, playerDb });
    console.log('[DB] All databases loaded successfully.');
  } catch (err) {
    console.error(`[DB] Error loading databases: ${err.message}`);
    process.exit(1);
  }
};

/**
 * Saves all persistent game state data.
 */
const saveDatabases = () => {
  try {
    console.log('[DB] Saving databases...');
    playerDb.save();
    roomDb.saveData();
    enemyDb.save();
    console.log('[DB] All databases saved successfully.');
  } catch (err) {
    console.error(`[DB] Error saving databases: ${err.message}`);
  }
};

// Automatically load databases on module import
loadDatabases();

module.exports = {
  itemDb,
  playerDb,
  roomDb,
  storeDb,
  enemyTpDb,
  enemyDb,
  saveDatabases,
};
