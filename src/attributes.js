'use strict';

const Attribute = {
  STRENGTH: 'STRENGTH',
  DEXTERITY: 'DEXTERITY',
  INTELLIGENCE: 'INTELLIGENCE',
};

const ItemType = {
  WEAPON: 'WEAPON',
  ARMOR: 'ARMOR',
};

const PlayerRank = {
  REGULAR: 'REGULAR',
  GOD: 'GOD',
  ADMIN: 'ADMIN',
};

const RoomType = {
  PLAIN_ROOM: 'PLAINROOM',
  STORE: 'STORE',
};

const Direction = {
  NORTH: 0,
  EAST: 1,
  SOUTH: 2,
  WEST: 3,
};

module.exports = {
  Attribute,
  ItemType,
  PlayerRank,
  RoomType,
  Direction,
};
