'use strict';

const { cyanBold, redBold, white, magenta, yellowBold, greenBold } = require('../../utils/formatting');
const { get_exits } = require('./room-navigation');
const { roomRepository, playerRepository, enemyRepository } = require('../../repository/repositories').get();

/**
 * Formats a list of entities into a labeled and colored string.
 *
 * Example: If list = [{ name: 'Goblin' }, { name: 'Orc' }],
 * colorFn = red, and label = 'Enemies', the output will be:
 *   "<red>Enemies: Goblin, Orc</red>\r\n"
 *
 * @param {Array<{ name: string }>} list - List of entities with a `name` field.
 * @param {(text: string) => string} colorFn - A function that wraps text in ANSI or tag-based color codes.
 * @param {string} label - The label prefix to display before the list.
 * @returns {string} A formatted string, or empty string if the list is empty.
 */
const get_names = (list, colorFn, label) => {
  if (!list.length) return '';
  const names = list.map((e) => e.name).join(', ');
  return colorFn(`${label}: ${names}`) + '\r\n';
};

const render_room = (roomId) => {
  const room = roomRepository.get(roomId);
  const header =
    yellowBold(room.name) + '\r\n' + white(room.description) + '\r\n' + greenBold('exits: ' + get_exits(room)) + '\r\n';

  const roomItem = get_names(room.items, magenta, 'Items');
  const roomPeople = get_names(playerRepository.find_by_room(room.id), cyanBold, 'People');
  const roomEnemies = get_names(enemyRepository.find_by_room(room.id), redBold, 'Enemies');

  const body = [header, roomItem ? 'You see: ' + roomItem + '\r\n' : '', roomPeople, roomEnemies]
    .filter(Boolean)
    .join('');

  return body;
};

module.exports = {
  get_names,
  render_room,
};
