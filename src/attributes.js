'use strict';

const Enum = require('enum');

const Attribute = new Enum({
  STRENGTH: 0,
  HEALTH: 1,
  AGILITY: 2,
  MAX_HIT_POINTS: 3,
  ACCURACY: 4,
  DODGING: 5,
  STRIKE_DAMAGE: 6,
  DAMAGE_ABSORB: 7,
  HP_REGEN: 8,
});

const ItemType = new Enum({
  WEAPON: 0,
  ARMOR: 1,
  HEALING: 2,
});

const PlayerRank = new Enum({
  REGULAR: 0,
  GOD: 1,
  ADMIN: 2,
});

const RoomType = new Enum({
  PLAIN_ROOM: 0,
  TRAINING_ROOM: 1,
  STORE: 2,
});

const Direction = new Enum({
  NORTH: 0,
  EAST: 1,
  SOUTH: 2,
  WEST: 3,
});

module.exports = {
  Attribute,
  ItemType,
  PlayerRank,
  RoomType,
  Direction,
};
