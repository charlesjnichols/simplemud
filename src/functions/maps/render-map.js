const _ = require('lodash');
const { gray, red, green, yellow, white, cyan, redBold, whiteBold } = require('../../utils/formatting');

/**
 * Renders a telnet-safe ASCII minimap.
 *
 * @param {Object<string, Room>} rooms - Map of room objects keyed by "x,y"
 * @param {{ x: number, y: number }} playerCoords
 * @param {Set<string>} [visibleRooms] - Optional fog-of-war
 * @returns {string[]} Rendered ASCII rows
 */
const renderZoneMap = (rooms, playerCoords, visibleRooms = null) => {
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
      const isVisible = !visibleRooms || visibleRooms.has(key);

      if (!room || !isVisible) {
        row += gray(' '); // unexplored or non-room tile
        continue;
      }

      const isPlayer = playerCoords.x === x && playerCoords.y === y;
      row += renderTile(room, isPlayer);
    }
    output.push(row);
  }

  return output;
};

const renderTile = (room, isPlayer) => {
  if (isPlayer) return yellow('@');
  if (room.type === 'start') return green('S');
  if (room.type === 'boss') return redBold('B');
  if (room.type === 'room') return gray('.');
  if (room.type === 'path') return cyan('.');
  if (room.type === 'wall') return whiteBold('.');
  return gray('?');
};

module.exports = { renderZoneMap };
