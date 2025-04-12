'use strict';

const _ = require('lodash');

const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');

const createEntityDatabase = require('../entity-database');
const createPlayer = require('./player');

const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(process.cwd(), 'data', 'players');

function createPlayerDatabase() {
  const db = createEntityDatabase();

  const save = () => {
    const file = path.join(dataPath, '_players.json');
    const dataArray = [];

    console.log('[DB] Saving all players...');
    db.values().forEach(player => {
      player.id = uuidv4();
      dataArray.push(player.name);
      savePlayer(player);
    });

    jsonfile.writeFileSync(file, dataArray, { spaces: 2 });
    console.log(`[DB] Saved player registry to ${file}`);
    return true;
  }


  const load = (itemDb, roomDb) => {
    db.clear();
    const file = path.join(dataPath, '_players.json');

    if (!fs.existsSync(file)) {
      console.warn('[DB] Warning: _players.json not found.');
      return false;
    }

    console.log('[DB] Loading all players...');
    const dataArray = jsonfile.readFileSync(file);
    dataArray.forEach(name => {
      const p = loadPlayer(name, itemDb, roomDb);
      if (p) {
        console.log(`[DB] Loaded player '${p.name}' '${p.id}'`);
        db.add(p);
      } else {
        console.warn(`[DB] Failed to load player '${name}'`);
      }
    });
    console.log(`[DB] Loaded ${db.size()} players.`);
    return true;
  }


  const loadPlayer = (name, itemDb, roomDb) => {
    try {
      const file = path.join(dataPath, `${name}.json`);
      const data = jsonfile.readFileSync(file);

      const player = createPlayer(data);

      player.inventory = [];
      player.items = 0;

      (data.inventory || []).forEach(id => {
        const item = itemDb.findById(parseInt(id));
        if (item) {
          player.inventory.push(item);
          player.items++;
        }
      });

      // Restore room as object if available
      const roomId = typeof data.room === 'number' ? data.room : 1;
      player.room = roomDb.findById(roomId) || roomId;

      player.recalculateStats();
      return player;
    } catch (err) {
      console.error(`[DB] Failed to load player '${name}': ${err.message}`);
      return null;
    }
  }

  const savePlayer = (player) => {
    const file = path.join(dataPath, `${player.name}.json`);
    jsonfile.writeFileSync(file, player.toJSON(), { spaces: 2 });
    console.log(`[DB] Saved player '${player.name}' to ${file}`);
  }


  const addPlayer = (player) => {
    if (db.hasId(player.id) || db.hasNameFull(player.name)) return false;
    db.add(player);
    save();
    return true;
  }

  const removePlayer = (player) => {
    if (!db.hasId(player.id)) return false;

    const file = path.join(dataPath, `${player.name}.json`);
    db.delete(player.id);
    save();

    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }

    return true;
  }

  const logout = (id) => {
    const player = db.findById(id);
    if (!player) return false;

    player.connection = 0;
    player.loggedIn = false;
    player.active = false;
    savePlayer(player);
    return true;
  }

  const findActive = (name) => {
    return findByNameWithFilter(name, p => p.active);
  }

  const findLoggedIn = (name) => {
    return findByNameWithFilter(name, p => p.loggedIn);
  }

  const findByNameWithFilter = (name, fn) => {
    return db.findByNameFull(name, fn) || db.findByNamePartial(name, fn);
  }

  return {
    save,
    load,
    addPlayer,
    savePlayer,
    removePlayer,
    logout,
    findActive,
    findLoggedIn,
    ..._.pick(db, ['get', 'keys', 'findByNameFull', 'values']),
  };
}

module.exports = createPlayerDatabase;
