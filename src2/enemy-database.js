'use strict';

const path = require('path');
const jsonfile = require('jsonfile');
const { EnemyTemplate, Enemy } = require('./enemy');

const fileTemplate = path.join(process.cwd(), 'data', 'enemies.json');
const fileData = path.join(process.cwd(), 'data', 'enemiesdata.json');

// ==========================
// EnemyTemplateDatabase
// ==========================
function createEnemyTemplateDatabase() {
  const map = new Map();
  let nextId = 1;

  function add(template) {
    template.id = nextId++;
    map.set(template.id, template);
  }

  function findById(id) {
    return map.get(id) || null;
  }

  function values() {
    return [...map.values()];
  }

  function clear() {
    map.clear();
  }

  function load() {
    try {
      const dataArray = jsonfile.readFileSync(fileTemplate);
      dataArray.forEach(data => {
        const template = new EnemyTemplate();
        template.load(data);
        add(template);
      });
      console.log('[DB] Enemy templates loaded.');
    } catch (err) {
      console.error(`[DB] Failed to load templates: ${err.message}`);
    }
  }

  return {
    load,
    add,
    findById,
    values,
    clear,
  };
}

// ==========================
// EnemyDatabase
// ==========================
function createEnemyDatabase() {
  const map = new Map();
  let nextId = 1;

  function add(enemy) {
    enemy.id = nextId++;
    map.set(enemy.id, enemy);
  }

  function findById(id) {
    return map.get(id) || null;
  }

  function values() {
    return [...map.values()];
  }

  function clear() {
    map.clear();
  }

  function create(template, room) {
    const e = new Enemy();
    e.loadTemplate(template);
    e.room = room;
    room.addEnemy(e);
    add(e);
    return e;
  }

  function remove(enemy) {
    if (enemy.room) {
      enemy.room.removeEnemy(enemy);
    }
    map.delete(enemy.id);
  }

  function load(enemyTpDb, roomDb) {
    try {
      clear();
      const dataArray = jsonfile.readFileSync(fileData);
      dataArray.forEach(data => {
        const enemy = new Enemy();
        enemy.loadData(data, enemyTpDb, roomDb);
        if (enemy.room) enemy.room.addEnemy(enemy);
        add(enemy);
      });
      console.log('[DB] Enemy instances loaded.');
    } catch (err) {
      console.error(`[DB] Failed to load enemies: ${err.message}`);
    }
  }

  function save() {
    try {
      const dataArray = values().map(e => e.serialize());
      jsonfile.writeFileSync(fileData, dataArray, { spaces: 2 });
      console.log('[DB] Enemy instances saved.');
    } catch (err) {
      console.error(`[DB] Failed to save enemies: ${err.message}`);
    }
  }

  return {
    load,
    save,
    create,
    delete: remove,
    findById,
    values,
    clear,
    map,
  };
}

module.exports = {
  createEnemyTemplateDatabase,
  createEnemyDatabase,
};
