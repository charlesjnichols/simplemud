'use strict';

const _ = require('lodash');
const debug = require('debug');
const log = debug('db:room:entity');
const error = debug('db:room:entity:error');

const { RoomType, Direction } = require('../attributes');
const { createRoomMessages } = require('./messages');

function createRoom(data = {}) {
  const rooms = _.mapValues(Direction, (key) => {
    const val = parseInt(data[key]);
    return isNaN(val) ? 0 : val;
  });

  const room = {
    id: data.ID ? parseInt(data.ID) : null,
    name: data.NAME || 'Unnamed Room',
    description: data.DESCRIPTION || 'UNDEFINED',
    type: RoomType[data.TYPE] || RoomType.PLAINROOM,
    data: data.DATA ? parseInt(data.DATA) : null,
    spawnWhich: data.ENEMY ? parseInt(data.ENEMY) : 0,
    maxEnemies: data.MAXENEMIES ? parseInt(data.MAXENEMIES) : 0,
    rooms,
    items: [],
    players: [],
    enemies: [],
  };

  if (room.id) {
    log(`Initialized room: ${room.name} (ID: ${room.id})`);
  }

  room.messages = createRoomMessages(room);

  return Object.assign(room, {
    addPlayer: (player) => {
      if (room.players.length >= 32) room.players.shift();
      room.players.push(player);
      log(`Player added to room '${room.name}': ${player.name}`);
    },

    removePlayer: (player) => {
      room.players = room.players.filter((p) => p !== player);
      log(`Player removed from room '${room.name}': ${player.name}`);
    },

    addItem: (item) => {
      if (room.items.length >= 32) room.items.shift();
      room.items.push(item);
      log(`Item added to room '${room.name}': ${item.name}`);
    },

    removeItem: (item) => {
      room.items = room.items.filter((i) => i !== item);
      log(`Item removed from room '${room.name}': ${item.name}`);
    },

    addEnemy: (enemy) => {
      room.enemies.push(enemy);
      enemy.room = room;
      log(`Enemy added to room '${room.name}': ${enemy.name}`);
    },

    removeEnemy: (enemy) => {
      room.enemies = room.enemies.filter((e) => e !== enemy);
      log(`Enemy removed from room '${room.name}': ${enemy.name}`);
    },

    loadTemplate: (dataObject) => {
      try {
        room.id = parseInt(dataObject.ID);
        room.name = dataObject.NAME;
        room.description = dataObject.DESCRIPTION;
        room.type = dataObject.TYPE;
        room.data = parseInt(dataObject.DATA);
        Object.keys(Direction).forEach((dir) => {
          room.rooms[dir] = parseInt(dataObject[dir]) || 0;
        });
        room.spawnWhich = parseInt(dataObject.ENEMY);
        room.maxEnemies = parseInt(dataObject.MAXENEMIES);
        log(`Loaded room template: ${room.name} (ID: ${room.id})`);
      } catch (err) {
        error(`Error loading template for room: ${err.message}`);
      }
    },

    loadData: (dataObject, itemDb) => {
      try {
        if (!room.id) room.id = parseInt(dataObject.ROOMID);
        room.items = [];
        dataObject.ITEMS.split(' ').forEach((idStr) => {
          const id = parseInt(idStr);
          if (!id) return;
          const item = itemDb.findById(id);
          if (item) {
            room.items.push(item);
            log(`Loaded item into room '${room.name}': ${item.name}`);
          }
        });
        log(`Loaded runtime data for room '${room.name}'`);
      } catch (err) {
        error(`Error loading room data: ${err.message}`);
      }
    },

    serialize: () => {
      log(`Serializing room '${room.name}'`);
      return {
        ROOMID: room.id,
        ITEMS: room.items.map((i) => i.id).join(' '),
      };
    },
  });
}

module.exports = createRoom;
