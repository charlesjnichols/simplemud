'use strict';

const _ = require('lodash');
const path = require('path');
const jsonfile = require('jsonfile');
const createEntityDatabase = require('../entity/database');
const { createEnemyTemplate, createEnemy } = require('./enemy');

const fileTemplate = path.join(process.cwd(), 'data', 'enemies.json');
const fileData = path.join(process.cwd(), 'data', 'enemiesdata.json');

function createEnemyTemplateDatabase() {
  const db = createEntityDatabase();

  const load = () => {
    console.log('[DB] Loading enemy templates...');
    const dataArray = jsonfile.readFileSync(fileTemplate);
    dataArray.forEach((data) => {
      const template = createEnemyTemplate(data);
      db.add(template);
    });
    console.log(`[DB] Loaded ${dataArray.length} enemy templates.`);
  };

  return {
    ..._.pick(db, ['values', 'findById', 'findByNameFull', 'hasId']),
    load,
  };
}

function createEnemyDatabase() {
  const db = createEntityDatabase();

  const create = (template, room, databases) => {
    const enemy = createEnemy({}, databases);
    enemy.loadTemplate(template);
    enemy.room = room;
    room.addEnemy(enemy);
    db.add(enemy);
    return enemy;
  };

  const remove = (enemy) => {
    enemy.room.removeEnemy(enemy);
    db.get(enemy.id) && db.delete(enemy.id);
  };

  const load = (databases) => {
    console.log('[DB] Loading enemies...');
    const dataArray = jsonfile.readFileSync(fileData);
    _.forEach(dataArray, (data) => {
      const enemy = createEnemy({}, databases);
      enemy.loadData(data);
      enemy.room.addEnemy(enemy);
      db.add(enemy);
    });
    console.log(`[DB] Loaded ${db.size()} enemies.`);
  };

  const save = () => {
    const dataArray = db.values().map((e) => e.serialize());
    jsonfile.writeFileSync(fileData, dataArray, { spaces: 2 });
    console.log(`[DB] Saved ${dataArray.length} enemies.`);
  };

  return {
    ..._.pick(db, ['values', 'findById']),
    create,
    delete: remove,
    load,
    save,
  };
}

module.exports = {
  createEnemyTemplateDatabase,
  createEnemyDatabase,
};
