'use strict';

const _ = require('lodash');
const path = require('path');
const jsonfile = require('jsonfile');
const createEntityDatabase = require('../entity/database');
const createItem = require('./item');

const filePath = path.join(process.cwd(), 'data', 'items.json');

function createItemDatabase() {
  const db = createEntityDatabase();

  function load() {
    try {
      db.clear();
      console.log('[DB] Loading item database...');

      const dataArray = jsonfile.readFileSync(filePath);
      dataArray.forEach((data) => {
        const item = createItem(data);
        db.add(item);
      });

      console.log(`[DB] Loaded ${db.size()} items.`);
    } catch (err) {
      console.error(`[DB] Failed to load item database: ${err.message}`);
    }
  }

  return {
    ..._.pick(db, ['values', 'findById']),
    load,
  };
}

module.exports = createItemDatabase;
