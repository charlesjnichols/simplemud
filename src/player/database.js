'use strict';

const _ = require('lodash');

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');

const { v4: uuidv4 } = require('uuid');

const createEntityDatabase = require('../entity-database');
const createPlayer = require('./player');

const { PlayerRank } = require('../attributes');
const { encryptPassword } = require('../utils/password-vault');

const PLAYER_DIR = path.resolve(process.cwd(), 'data/players');

function createPlayerDatabase() {
  const db = createEntityDatabase();

  const save = () => {
    console.log('[DB] Saving all players...');
    db.values().forEach((player) => {
      player.id = uuidv4();
      savePlayer(player);
    });
    console.log('[DB] Saved all players to individual files.');
    return true;
  };

  const ensureAdminPlayer = () => {
    const hasAdmin = db.findByRank(PlayerRank.get('ADMIN'));

    if (!hasAdmin) {
      const password = crypto.randomBytes(12).toString('base64');
      const encrypted = encryptPassword(password);
      const adminData = {
        name: 'admin',
        password: encrypted,
        rank: PlayerRank.get('ADMIN'),
        inventory: [],
        stats: { hp: 100, mp: 50, level: 100, xp: 0 },
      };

      const adminPlayer = createPlayer(adminData);
      savePlayer(adminPlayer);
      db.add(adminPlayer);

      console.log(`[DB] Inof: No admin found. Created default admin with password: ${password}`);
    }
  };

  const load = (itemDb, roomDb) => {
    db.clear();

    if (!fs.existsSync(PLAYER_DIR)) {
      console.warn('[DB] Warning: player data directory not found.');
      return false;
    }

    console.log('[DB] Scanning player directory...');
    const files = fs.readdirSync(PLAYER_DIR);

    _(files)
      .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
      .map((f) => path.basename(f, '.json'))
      .forEach((name) => {
        const p = loadPlayer(name, itemDb, roomDb);
        if (p) {
          console.log(`[DB] Loaded player '${p.name}' '${p.id}'`);
          db.add(p);
        } else {
          console.warn(`[DB] Failed to load player '${name}'`);
        }
      });

    console.log(`[DB] Loaded ${db.size()} players.`);

    console.log('[DB] Ensuring an admin exists...');
    ensureAdminPlayer();

    return true;
  };

  const loadPlayer = (name, itemDb, roomDb) => {
    try {
      const file = path.join(PLAYER_DIR, `${name}.json`);
      const data = jsonfile.readFileSync(file);

      const player = createPlayer(data);

      player.inventory = [];
      player.items = 0;

      (data.inventory || []).forEach((id) => {
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
  };

  const savePlayer = (player) => {
    const file = path.join(PLAYER_DIR, `${player.name}.json`);
    jsonfile.writeFileSync(file, player.toJSON(), { spaces: 2 });
    console.log(`[DB] Saved player '${player.name}' to ${file}`);
  };

  const addPlayer = (player) => {
    if (db.hasId(player.id) || db.hasNameFull(player.name)) return false;
    db.add(player);
    save();
    return true;
  };

  const removePlayer = (player) => {
    if (!db.hasId(player.id)) return false;

    const file = path.join(PLAYER_DIR, `${player.name}.json`);
    db.delete(player.id);

    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
    return true;
  };

  const logout = (id) => {
    const player = db.findById(id);
    if (!player) return false;

    player.connection = 0;
    player.loggedIn = false;
    player.active = false;
    savePlayer(player);
    return true;
  };

  const findActive = (name) => {
    return findByNameWithFilter(name, (p) => p.active);
  };

  const findLoggedIn = (name) => {
    return findByNameWithFilter(name, (p) => p.loggedIn);
  };

  const findByNameWithFilter = (name, fn) => {
    return db.findByNameFull(name, fn) || db.findByNamePartial(name, fn);
  };

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
