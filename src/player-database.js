'use strict';

const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');
const Player = require('./player');
const createEntityDatabase = require('./entity-database');

const dataPath = path.join(process.cwd(), 'data', 'players');

function createPlayerDatabase() {
  const db = createEntityDatabase();

  function save() {
    const file = path.join(dataPath, '_players.json');
    const dataArray = [];

    // Renumber and persist each player
    let index = 0;
    db.values().forEach(player => {
      player.id = ++index;
      dataArray.push(player.name);
      savePlayer(player);
    });

    jsonfile.writeFileSync(file, dataArray, { spaces: 2 });
    return true;
  }

  function load(itemDb) {
    db.clear();
    const file = path.join(dataPath, '_players.json');

    if (!fs.existsSync(file)) {
      console.warn('[DB] Warning: _players.json not found.');
      return false;
    }

    const dataArray = jsonfile.readFileSync(file);
    dataArray.forEach(name => loadPlayer(name, itemDb));
    return true;
  }

  function loadPlayer(name, itemDb) {
    const file = path.join(dataPath, `${name}.json`);

    if (!fs.existsSync(file)) {
      console.warn(`[DB] Missing player file: ${name}.json`);
      return;
    }

    const data = jsonfile.readFileSync(file);
    const player = new Player();
    player.load(data, itemDb);
    addPlayer(player);
  }

  function savePlayer(player) {
    const file = path.join(dataPath, `${player.name}.json`);
    jsonfile.writeFileSync(file, player.serialize(), { spaces: 2 });
  }

  function addPlayer(player) {
    if (db.hasId(player.id) || db.hasNameFull(player.name)) return false;
    db.add(player);
    save();
    return true;
  }

  function removePlayer(player) {
    if (!db.hasId(player.id)) return false;

    const file = path.join(dataPath, `${player.name}.json`);
    db.map.delete(player.id);
    save();

    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }

    return true;
  }

  function logout(id) {
    const player = db.findById(id);
    if (!player) return false;

    player.connection = 0;
    player.loggedIn = false;
    player.active = false;
    savePlayer(player);
    return true;
  }

  function findActive(name) {
    return findByNameWithFilter(name, p => p.active);
  }

  function findLoggedIn(name) {
    return findByNameWithFilter(name, p => p.loggedIn);
  }

  function findByNameWithFilter(name, fn) {
    return db.findByNameFull(name, fn) || db.findByNamePartial(name, fn);
  }

  return {
    ...db,
    save,
    load,
    addPlayer,
    removePlayer,
    logout,
    findActive,
    findLoggedIn,
  };
}

module.exports = createPlayerDatabase;
