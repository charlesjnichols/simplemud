'use strict';

const { RoomType, Direction } = require('../attributes');
// eslint-disable-next-line no-unused-vars
const { matchFull, matchPartial } = require('../utils/matcher');

const { createRoomMessages } = require("./messages");

function createRoom(data = {}) {
  const rooms = Direction.enums.reduce((acc, dir) => {
    acc[dir] = 0;
    return acc;
  }, {});

  const room = {
    id: data.ID ? parseInt(data.ID) : null,
    name: data.NAME || 'Unnamed Room',
    description: data.DESCRIPTION || 'UNDEFINED',
    type: RoomType.get(data.TYPE || 'PLAINROOM'),
    data: data.DATA ? parseInt(data.DATA) : null,
    spawnWhich: data.ENEMY ? parseInt(data.ENEMY) : 0,
    maxEnemies: data.MAXENEMIES ? parseInt(data.MAXENEMIES) : 0,
    rooms,
    items: [],
    money: 0,
    players: [],
    enemies: []
  };

  room.messages = createRoomMessages(room);

  // ---------- Behavior ----------

  const _findIn = (collection, name) => {
    const match = (fn) =>
      collection.find(obj => obj?.[fn]?.call(obj, name)) || 0;
    return match('matchFull') || match('matchPartial');
  };

  return Object.assign(room, {
    addPlayer: (player) => {
      if (room.players.length >= 32) room.players.shift();
      room.players.push(player);
    },

    removePlayer: (player) =>
      room.players = room.players.filter(p => p !== player),

    addItem: (item) => {
      if (room.items.length >= 32) room.items.shift();
      room.items.push(item);
    },

    removeItem: (item) =>
      room.items = room.items.filter(i => i !== item),

    findItem: (name) => _findIn(room.items, name),

    addEnemy: (enemy) => {
      room.enemies.push(enemy);
      enemy.room = room;
    },

    removeEnemy: (enemy) =>
      room.enemies = room.enemies.filter(e => e !== enemy),

    findEnemy: (name) => _findIn(room.enemies, name),

    loadTemplate: (dataObject) => {
      room.id = parseInt(dataObject.ID);
      room.name = dataObject.NAME;
      room.description = dataObject.DESCRIPTION;
      room.type = RoomType.get(dataObject.TYPE);
      room.data = parseInt(dataObject.DATA);
      Direction.enums.forEach(dir => {
        room.rooms[dir] = parseInt(dataObject[dir.key]);
      });
      room.spawnWhich = parseInt(dataObject.ENEMY);
      room.maxEnemies = parseInt(dataObject.MAXENEMIES);
    },

    loadData: (dataObject, itemDb) => {
      if (!room.id) room.id = parseInt(dataObject.ROOMID);
      room.items = [];
      dataObject.ITEMS.split(' ').forEach(idStr => {
        const id = parseInt(idStr);
        if (!id) return;
        const item = itemDb.findById(id);
        if (item) room.items.push(item);
      });
      room.money = parseInt(dataObject.MONEY);
    },

    serialize: () => ({
      ROOMID: room.id,
      ITEMS: room.items.map(i => i.id).join(' '),
      MONEY: room.money,
    }),
  });
}

module.exports = createRoom;
