'use strict';

/**
 * @readonly
 * @enum {string}
 */
const ItemType = {
  WEAPON: 'WEAPON',
  ARMOR: 'ARMOR',
};

/**
 * @readonly
 * @enum {string}
 */
const PlayerRank = {
  REGULAR: 'REGULAR',
  GOD: 'GOD',
  ADMIN: 'ADMIN',
};

/**
 * @readonly
 * @enum {string}
 */
const RoomType = {
  PLAIN_ROOM: 'PLAINROOM',
  STORE: 'STORE',
};

/**
 * @readonly
 * @enum {string}
 */
const Direction = {
  NORTH: 'NORTH',
  EAST: 'EAST',
  SOUTH: 'SOUIH',
  WEST: 'SOUIH',
};

/**
 * @readonly
 * @enum {string}
 */
const ActorType = {
  PLAYER: 'PLAYER',
  NPC: 'NPC',
  ENEMY: 'ENEMY',
};

const STATBAR_INTERVAL_MS = 5000;

module.exports = {
  ItemType,
  PlayerRank,
  RoomType,
  Direction,
  ActorType,
  STATBAR_INTERVAL_MS,
};
