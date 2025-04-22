/**
 *
 * @typedef {import('../../models/player').Player} Player
 *
 */

const _ = require('lodash');
const { gray, green, yellow, cyan, redBold, whiteBold } = require('../../utils/formatting');

/**
 * Renders a telnet-safe ASCII minimap.
 *
 * @param {Object<string, import('./create-zone-map').Room>} rooms - Map of room objects keyed by "x,y"
 * @param  {Player} player
 * @param {Set<string>|null} [visibleRooms] - Optional fog-of-war
 * @returns {string[]} Rendered ASCII rows
 */
const render_zone_map = (rooms, player, visibleRooms = null) => {
  const coords = Object.values(rooms).map((r) => r.coords);
  if (coords.length === 0) return ['(no rooms)'];

  const minX = _.minBy(coords, 'x').x;
  const maxX = _.maxBy(coords, 'x').x;
  const minY = _.minBy(coords, 'y').y;
  const maxY = _.maxBy(coords, 'y').y;

  const output = [];

  for (let y = minY; y <= maxY; y++) {
    let row = '';
    for (let x = minX; x <= maxX; x++) {
      const key = `${x},${y}`;
      const room = rooms[key];

      if (!room) {
        row += gray(' '); // unexplored or non-room tile
        continue;
      }

      if (visibleRooms) {
        const isDirectlyVisible = visibleRooms?.has(`${room.zone}:${key}`);
        const isAdjacent = isAdjacentToVisible(key, visibleRooms, room.zone);
        const isVisible = room && (isDirectlyVisible || (room.type === 'wall' && isAdjacent));

        if (!isVisible) {
          row += gray(' '); // unexplored or non-room tile
          continue;
        }
      }

      // const isPlayer = playerCoords.x === x && playerCoords.y === y;
      const isPlayer = room.id === player.room;
      row += renderTile(room, isPlayer);
    }
    output.push(row);
  }

  return output;
};

/**
 * Checks if a room is adjacent to any visible room.
 *
 * @param {string} coord - The "x,y" coordinate string of the current room
 * @param {Set<string>} visibleRooms - Set of visible room IDs (zone:x,y)
 * @param {string} zone
 * @returns {boolean}
 */
function isAdjacentToVisible(coord, visibleRooms, zone) {
  const [x, y] = coord.split(',').map(Number);
  const neighbors = [`${x},${y - 1}`, `${x + 1},${y}`, `${x},${y + 1}`, `${x - 1},${y}`];
  return neighbors.some((neighbor) => visibleRooms.has(`${zone}:${neighbor}`));
}

const renderTile = (/** @type {{ type: string; }} */ room, /** @type {boolean} */ isPlayer) => {
  if (isPlayer) return yellow('@');
  if (room.type === 'start') return green('S');
  if (room.type === 'boss') return redBold('B');
  if (room.type === 'room') return gray('.');
  if (room.type === 'path') return gray('.');
  if (room.type === 'wall') return whiteBold('#');
  return gray('?');
};

module.exports = { render_zone_map };
