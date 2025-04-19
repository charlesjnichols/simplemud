/**
 * @module src/commands/global/quit.js
 *
 * Command handler for the `quit` command.
 * Cleans up the player's connection and broadcasts their departure.
 */

const { send_to_everyone } = require('../../functions/world');
const { yellowBold } = require('../../utils/formatting');

const { playerRepository, connectionRepository } = require('../../repository/repositories').get();

/**
 * Handles a player quitting the game.
 *
 * @param {import('../../models/player').Player} player
 */
module.exports = (player) => {
  playerRepository.delete(player.id);

  const connection = connectionRepository.getConnection(player.id);
  if (connection) {
    connection.close();
  }

  send_to_everyone(yellowBold(`${player.name} has left the realm.`));
};
