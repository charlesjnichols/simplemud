'use strict';

const debug = require('debug');
const log = debug('db:load');
const error = debug('db:error');

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
    log('Loading databases...');

    log('Loading itemDb...');
    itemDb.load();

    log('Loading enemyTpDb...');
    enemyTpDb.load();

    log('Loading enemyDb...');
    enemyDb.load();

    log('Loading storeDb...');
    storeDb.load({ itemDb });

    log('Loading roomDb templates...');
    roomDb.loadTemplates({ storeDb });

    log('Loading roomDb data...');
    roomDb.loadData({ itemDb });

    log('Loading playerDb...');
    playerDb.load({ itemDb, roomDb, playerDb });

    log('All databases loaded successfully.');
  } catch (err) {
    error(`Error loading databases: ${err.message}\n${err.stack}`);
    process.exit(1);
  }
};

/**
 * Saves all persistent game state data.
 */
const saveDatabases = () => {
  try {
    log('Saving databases...');
    playerDb.save();
    roomDb.saveData();
    enemyDb.save();
    log('All databases saved successfully.');
  } catch (err) {
    error(`Error saving databases: ${err.message}\n${err.stack}`);
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
