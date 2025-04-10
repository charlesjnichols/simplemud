'use strict';

const path = require('path');
const jsonfile = require('jsonfile');
const Store = require('./store');
const createEntityDatabase = require('./entity-database');

const file = path.join(process.cwd(), 'data', 'stores.json');

function createStoreDatabase() {
  const db = createEntityDatabase();

  function load(itemDb) {
    db.clear();
    const dataArray = jsonfile.readFileSync(file);
    dataArray.forEach(data => {
      const store = new Store();
      store.load(data, itemDb);
      db.add(store);
    });
    console.log('[DB] Store database loaded.');
  }

  return {
    ...db,
    load,
  };
}

module.exports = createStoreDatabase;
