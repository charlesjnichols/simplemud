/**
 * @module functions/world/send
 *
 * Utility functions for broadcasting messages to players across the world or within specific contexts.
 *
 * @typedef {import('../../models/player').Player} Player
 * @typedef {import('../../models/enemy').Enemy} Enemy
 */

'use strict';

const { cyanBold, redBold } = require('../../utils/formatting');
const { send } = require('../player');

const { playerRepository } = require('../../repository/repositories').get();

send;

/**
 * Sends a message to all connected players in the game.
 *
 * @param {string} message - The message to broadcast.
 */
const send_to_everyone = (message) => playerRepository.values().forEach((player) => send(player, message));

/**
 * Sends a message to all players except the given one.
 *
 * @param {Player} exclude - The player to exclude from the broadcast.
 * @param {string} message - The message to send.
 */
const send_to = (exclude, message) => {
  playerRepository.find_by(exclude.id).forEach((player) => send(player, message));
};

/**
 * Sends a message to all other players in the same room as the given player.
 *
 * @param {Player|Enemy} player - The player whose room is used for lookup.
 * @param {string} message - The message to send to others in the room.
 */
const send_to_room = (player, message) => {
  playerRepository.find_by_room(player.room, null).forEach((other) => send(other, message));
};

/**
 * Sends a message to all other players in the same room as the given player.
 *
 * @param {string} roomId - The player whose room is used for lookup.
 * @param {string} message - The message to send to others in the room.
 */
const send_to_roomId = (roomId, message) => {
  playerRepository.find_by_room(roomId).forEach((other) => send(other, message));
};

/**
 * Sends a logout or disconnect message to all players, styled in red.
 *
 * @param {string} reason - The logout or disconnect reason.
 */
const send_logout = (reason) => {
  send_to_everyone(redBold(reason));
};

/**
 * Sends a global announcement to all players, styled in cyan.
 *
 * @param {string} announcement - The announcement message.
 */
const send_announcement = (announcement) => {
  send_to_everyone(cyanBold(announcement));
};

module.exports = {
  send_announcement,
  send_to_everyone,
  send_logout,
  send_to,
  send_to_room,
  send_to_roomId,
};
