/**
 * @module functions/room/room-items
 *
 * Provides utility functions to manage item arrays in room objects,
 * including adding and removing items with size limits and debug logging.
 *
 * @typedef {import('../../models/item').Item} Item
 * @typedef {import('../../models/room').Room} Room
 */

'use strict';

const debugAdd = require('debug')('mud:core:functions:room:add_item');
const debugRemove = require('debug')('mud:core:functions:room:remove_item');

/**
 * Adds an item to a room. If the room has more than 32 items, the oldest is removed.
 *
 * @param {Room} room - The room to modify.
 * @param {Item} item - The item to add.
 */
const add_item = (room, item) => {
  if (room.items && room.items?.length >= 32) {
    room.items?.shift();
  }
  room.items?.push(item);
  debugAdd(`Item '${item.name}' added to room '${room.name}': ${item.name}`);
};

/**
 * Removes a specific item from a room.
 *
 * @param {Room} room - The room to modify.
 * @param {Item} item - The item to remove.
 */
const remove_item = (room, item) => {
  room.items = room.items?.filter((i) => i !== item);
  debugRemove(`Item '${item.name}' removed from room '${room.name}': ${item.name}`);
};

module.exports = {
  add_item,
  remove_item,
};
