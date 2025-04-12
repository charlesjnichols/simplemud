'use strict';

const _ = require('lodash');

const path = require('path');
const jsonfile = require('jsonfile');
const createRoom = require('./room');
const createEntityDatabase = require('./entity-database');

const fileMap = path.join(process.cwd(), 'data', 'map.json');
const fileMapData = path.join(process.cwd(), 'data', 'mapdata.json');

function createRoomDatabase() {
  const db = createEntityDatabase();

  function loadTemplates() {
    db.clear();
    const dataArray = jsonfile.readFileSync(fileMap);
    dataArray.forEach(data => {
      const room = createRoom();
      room.loadTemplate(data);
      db.add(room);
    });
    console.log(`[DB] Loaded ${db.size()} rooms templates.`);
  }

  function loadData(itemDb) {
    const dataArray = jsonfile.readFileSync(fileMapData);
    dataArray.forEach(data => {
      const roomId = parseInt(data.ROOMID);
      const room = db.findById(roomId);
      if (room) {
        room.loadData(data, itemDb);
      }
    });
    console.log(`[DB] Loaded ${db.size()} rooms.`);
  }

  function saveData() {
    const roomsToSave = db.values().filter(r => r.items.length || r.money > 0);
    const dataArray = roomsToSave.map(room => room.serialize());
    jsonfile.writeFileSync(fileMapData, dataArray, { spaces: 2 });
    console.log('[DB] Room data saved.');
  }

  return {
    ..._.pick(db, ['values','findById']),
    loadTemplates,
    loadData,
    saveData,
  };
}

module.exports = createRoomDatabase;
