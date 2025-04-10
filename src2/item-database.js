'use strict';

const path = require('path');
const jsonfile = require('jsonfile');
const createEntityDatabase = require('./entity-database');
const Item = require('./item');

const filePath = path.join(process.cwd(), 'data', 'items.json');

function createItemDatabase() {
  const db = createEntityDatabase();

  function load() {
    try {
      db.clear();

      const dataArray = jsonfile.readFileSync(filePath);
      dataArray.forEach(data => {
        const item = new Item();
        item.load(data);
        db.add(item);
      });
      console.log('[DB] Item database loaded.');
    } catch (err) {
      console.error(`[DB] Failed to load item database: ${err.message}`);
    }
  }

  return {
    ...db,
    load,
  };
}

module.exports = createItemDatabase;
