/**
 * @module player/messaging
 *
 * Messaging and prompt display behaviors for a player.
 * These functions require access to the `connections` repository
 * to deliver messages over the network.
 *
 * @typedef {import('../../../models/player').Player} Player
 */

const { STATBAR_INTERVAL_MS } = require('./constants');
const { connectionRepository } = require('../../datastores').get();

/**
 * Sends the command prompt ("> ") to the player's connection.
 *
 * @param {Player} player - The player to prompt.
 */
function send_prompt(player) {
  send_message(player, '> ');
}

/**
 * Sends a formatted statbar message to the player's connection.
 *
 * @param {Player} player - The player to send the statbar to.
 */
function send_stats_bar(player) {
  send_message(player, `[HP: ${player.hp}/${player.maxHp}]`);
}

/**
 * Sends a message to the player's connection. If the player's HP has changed or the statbar
 * hasn't been updated recently, the statbar will be automatically resent.
 *
 * @param {Player} player - The player to send the message to.
 * @param {string} message - The message to send.
 */
function send(player, message) {
  const now = Date.now();

  send_message(player, message);

  const hpChanged = player.lastSentHp == null || player.hp !== player.lastSentHp;
  const timeElapsed = player.lastStatbarTime == null || now - player.lastStatbarTime >= STATBAR_INTERVAL_MS;

  if (hpChanged || timeElapsed) {
    player.lastSentHp = player.hp;
    player.lastStatbarTime = now;
    send_stats_bar(player);
  }
}

function send_message(player, message) {
  const connection = connectionRepository.getConnection(player.id);
  if (!connection) {
    console.error(`Trying to send to ${player.name} but no connection.`);
    return;
  }
  connection.sendMessage(message + '\r\n');
}

module.exports = {
  send_stats_bar,
  send_prompt,
  send_message,
  send,
};
