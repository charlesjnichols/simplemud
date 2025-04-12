const { whiteBold, magentaBold, greenBold, yellowBold, cyanBold, redBold } = require('../utils/formatting');
const { Direction } = require('../attributes');

const createRoomMessages = (room) => {
  const printRoom = () => {
    const header =
      whiteBold(room.name) +
      '\r\n' +
      magentaBold(room.description) +
      '\r\n' +
      greenBold('exits: ' + getExits()) +
      '\r\n';

    const items = getRoomItems();
    const people = getNames(room.players, cyanBold, 'People');
    const enemies = getNames(room.enemies, redBold, 'Enemies');

    const body = [header, items ? yellowBold('You see: ' + items) + '\r\n' : '', people, enemies]
      .filter(Boolean)
      .join('');

    return body;
  };

  const getExits = () =>
    Direction.enums
      .filter((dir) => room.rooms[dir] !== 0)
      .map((dir) => dir.key)
      .join('  ');

  const getRoomItems = () => {
    const list = [];
    if (room.money > 0) list.push(`$${room.money}`);
    room.items.forEach((i) => list.push(i.name));
    return list.length ? list.join(', ') : '';
  };

  const getNames = (list, colorFn, label) => {
    if (!list.length) return '';
    const names = list.map((e) => e.name).join(', ');
    return colorFn(`${label}: ${names}`) + '\r\n';
  };

  return {
    printRoom,
    getExits,
    getRoomItems,
    getNames,
  };
};

module.exports = {
  createRoomMessages,
};
