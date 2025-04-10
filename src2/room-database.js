'use strict';

const path = require('path');
const jsonfile = require('jsonfile');
const Room = require('./room');
const createEntityDatabase = require('./entity-database');

const fileMap = path.join(process.cwd(), 'data', 'map.json');
const fileMapData = path.join(process.cwd(), 'data', 'mapdata.json');

function createRoomDatabase() {
  const db = createEntityDatabase();

  function loadTemplates() {
    db.clear();
    const dataArray = jsonfile.readFileSync(fileMap);
    dataArray.forEach(data => {
      const room = new Room();
      room.loadTemplate(data);
      db.add(room);
    });
    console.log('[DB] Room templates loaded.');
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
    console.log('[DB] Room data loaded.');
  }

  function saveData() {
    const roomsToSave = db.values().filter(r => r.items.length || r.money > 0);
    const dataArray = roomsToSave.map(room => room.serialize());
    jsonfile.writeFileSync(fileMapData, dataArray, { spaces: 2 });
    console.log('[DB] Room data saved.');
  }

  return {
    ...db,
    loadTemplates,
    loadData,
    saveData,
  };
}

module.exports = createRoomDatabase;
