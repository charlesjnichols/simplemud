'use strict';

const _ = require('lodash');
const debug = require('debug');
const log = debug('db:room');
const error = debug('db:room:error');

const path = require('path');
const jsonfile = require('jsonfile');
const createRoom = require('./room');
const createEntityDatabase = require('../entity/database');
const { RoomType } = require('../attributes');

const fileMap = path.join(process.cwd(), 'data', 'map.json');
const fileMapData = path.join(process.cwd(), 'data', 'mapdata.json');

function createRoomDatabase() {
  const db = createEntityDatabase();

  function loadTemplates({ storeDb }) {
    try {
      log('Loading room templates from %s', fileMap);
      db.clear();
      const dataArray = jsonfile.readFileSync(fileMap);
      dataArray.forEach((data) => {
        const room = createRoom();
        room.loadTemplate(data);

        if (room.type === RoomType.STORE) {
          room.store = storeDb.findById(room.data);
          log(`Linked store '${room.store?.name || 'UNKNOWN'}' to store room '${room.name}'`);
        }

        db.add(room);
      });
      log(`Loaded ${db.size()} room templates.`);
    } catch (err) {
      error(`Failed to load room templates: ${err.message}`, err);
      process.exit(1);
      throw err;
    }
  }

  function loadData({ itemDb }) {
    try {
      log('Loading room data from %s', fileMapData);
      const dataArray = jsonfile.readFileSync(fileMapData);
      dataArray.forEach((data) => {
        const roomId = parseInt(data.ROOMID);
        const room = db.findById(roomId);
        if (room) {
          room.loadData(data, itemDb);
        } else {
          log(`No room found for ID ${roomId}, skipping.`);
        }
      });
      log(`Loaded data for ${db.size()} rooms.`);
    } catch (err) {
      error(`Failed to load room data: ${err.message}\n${err.stack}`);
      throw err;
    }
  }

  function saveData() {
    try {
      log('Saving room data to %s', fileMapData);
      const roomsToSave = db.values().filter((r) => r.items.length || r.money > 0);
      const dataArray = roomsToSave.map((room) => room.serialize());
      jsonfile.writeFileSync(fileMapData, dataArray, { spaces: 2 });
      log(`Saved ${roomsToSave.length} rooms.`);
    } catch (err) {
      error(`Failed to save room data: ${err.message}\n${err.stack}`);
      throw err;
    }
  }

  return {
    ..._.pick(db, ['values', 'findById']),
    loadTemplates,
    loadData,
    saveData,
  };
}

module.exports = createRoomDatabase;
