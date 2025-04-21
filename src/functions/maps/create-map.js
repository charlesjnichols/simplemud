// @ts-nocheck
const Dungrain = require('dungrain');
const _ = require('lodash');
const seedrandom = require('seedrandom');

/**
 * @typedef {{
 *   id: string,
 *   name: string,
 *   zone: string,
 *   coords: { x: number, y: number },
 *   type: string,
 *   exits: Record<string, string>,
 *   isAnchor: boolean,
 *   description?: string
 * }} Room
 */

/**
 * Generates a MUD-compatible zone map using `dungrain`.
 *
 * @param {{
 *   column: number,
 *   row: number,
 *   seed?: string,
 *   zone: string,
 *   iterationCount: number,
 *   anchors?: {
 *     start?: 'center' | 'edge',
 *     boss?: 'furthest' | 'mid'
 *   },
 *   indexMap?: {
 *     Wall: number,
 *     Path: number,
 *     Room: number,
 *     Empty: number
 *   }
 * }} options
 * @returns {Record<string, Room>}
 */
const createZoneMap = ({
  column,
  row,
  seed = Date.now().toString(),
  zone,
  iterationCount = 5,
  anchors = { start: 'center', boss: 'furthest' },
  indexMap = {
    Wall: 3,
    Path: 2,
    Room: 1,
    Empty: 0,
  },
}) => {
  const dungeon = new Dungrain({
    iterationCount,
    column,
    row,
    seed,
    indexMap,
  });

  const raw = dungeon.getMap();
  const rooms = {};
  const coordsList = [];

  raw.forEach((rowData, y) => {
    rowData.forEach((index, x) => {
      if (![indexMap.Room, indexMap.Path, indexMap.Wall].includes(index)) return;

      const key = `${x},${y}`;
      const type = index === indexMap.Room ? 'room' : index === indexMap.Path ? 'path' : 'wall';

      coordsList.push({ key, x, y });

      rooms[key] = {
        id: `${zone}:${key}`,
        name: _.startCase(type),
        zone,
        coords: { x, y },
        type,
        exits: {},
        isAnchor: false,
      };
    });
  });

  const getRoomKey = (x, y) => `${x},${y}`;

  Object.values(rooms).forEach((room) => {
    if (room.type === 'wall') return;

    const { x, y } = room.coords;
    const directions = {
      NORTH: [x, y - 1],
      SOUTH: [x, y + 1],
      EAST: [x + 1, y],
      WEST: [x - 1, y],
    };

    _.forEach(directions, ([dx, dy], dir) => {
      const neighborKey = `${dx},${dy}`;
      const neighbor = rooms[neighborKey];
      if (!neighbor || neighbor.type === 'wall') return;

      room.exits[dir] = neighbor.id;
      room.exits[`_${dir.toLowerCase()}`] = neighbor.name;
    });
  });

  const center = [Math.floor(column / 2), Math.floor(row / 2)];

  const walkableRooms = coordsList.filter(({ key }) => {
    const r = rooms[key];
    return r.type !== 'wall';
  });

  const startKey = findNearestRoom(walkableRooms, center);

  if (anchors.start) {
    const startRoom = rooms[startKey];
    rooms[startKey] = {
      ...startRoom,
      type: 'start',
      name: 'Starting Room',
      description: `This is where your journey in ${zone} begins.`,
      isAnchor: true,
    };
  }

  const bossKey = findFurthestRoom(walkableRooms, startKey);

  if (anchors.boss && bossKey) {
    const bossRoom = rooms[bossKey];
    rooms[bossKey] = {
      ...bossRoom,
      type: 'boss',
      name: 'Boss Lair',
      description: `An ominous presence fills this chamber.`,
      isAnchor: true,
    };
  }

  return rooms;
};

/**
 * Finds the closest room to a given coordinate.
 * @param {{ key: string, x: number, y: number }[]} coordsList
 * @param {[number, number]} target
 * @returns {string}
 */
const findNearestRoom = (coordsList, [cx, cy]) =>
  _.minBy(coordsList, ({ x, y }) => Math.abs(x - cx) + Math.abs(y - cy)).key;

/**
 * Finds the furthest room from a given key.
 * @param {{ key: string, x: number, y: number }[]} coordsList
 * @param {string} fromKey
 * @returns {string}
 */
const findFurthestRoom = (coordsList, fromKey) => {
  const [fx, fy] = fromKey.split(',').map(Number);
  return _.maxBy(coordsList, ({ x, y }) => Math.abs(x - fx) + Math.abs(y - fy)).key;
};

module.exports = { createZoneMap };
