'use strict';

const _ = require('lodash');

const path = require('path');
const jsonfile = require('jsonfile');
const createStore = require('./store');
const createEntityDatabase = require('../entity-database');

const file = path.join(process.cwd(), 'data', 'stores.json');

function createStoreDatabase() {
  const db = createEntityDatabase();

  function load(itemDb) {
    db.clear();
    const dataArray = jsonfile.readFileSync(file);
    dataArray.forEach(data => {
      const store = createStore({});
      store.load(data, itemDb);
      db.add(store);
    });
    console.log('[DB] Store database loaded.');
  }

  return {
    ..._.pick(db, ['values','findById']),
    load,
  };
}

module.exports = createStoreDatabase;
