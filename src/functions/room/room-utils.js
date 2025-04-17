/**
 * @module room/utils/is_in_store
 *
 * Utility to determine whether a given room is a store.
 *
 * @typedef {import('../../models/room').Room} Room
 */

'use strict';

const { RoomType } = require('../../config');

/**
 * Returns true if the room is of type `RoomType.STORE`.
 *
 * @param {Room} room - The room object to check.
 * @returns {boolean} True if the room is a store.
 */
const is_in_store = (room) => room.type === RoomType.STORE;

module.exports = {
  is_in_store,
};
