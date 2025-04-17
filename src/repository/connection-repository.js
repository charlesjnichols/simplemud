/**
 * @module repository/connection-repository
 *
 * Provides a simple connection cache for mapping player IDs to their active network connections.
 */
const { SortedMap } = require('insort');

/**
 * @typedef {import('../connections/connection')} Connection
 */

/**
 * Creates a new connection cache using a sorted map.
 * Each connection is keyed by a player's unique ID.
 *
 * @returns {{
 *   addConnection: (playerId: number|string, connection: Connection) => void,
 *   getConnection: (playerId: number|string) => Connection | undefined,
 *   removeConnection: (playerId: number|string) => void
 * }} A simple API for managing player-to-connection mappings.
 */
const create_connection_cache = () => {
  const connections = new SortedMap();

  /**
   * Adds a new connection associated with a player ID.
   *
   * @param {number|string} playerId - Unique identifier of the player.
   * @param {Connection} connection - The player's connection object.
   */
  function addConnection(playerId, connection) {
    connections.set(playerId, connection);
  }

  /**
   * Retrieves a connection by player ID.
   *
   * @param {number|string} playerId - The ID of the player.
   * @returns {Connection | undefined} The player's connection, or undefined if not found.
   */
  function getConnection(playerId) {
    return connections.get(playerId);
  }

  /**
   * Removes a connection associated with the given player ID.
   *
   * @param {number|string} playerId - The ID of the player whose connection should be removed.
   */
  function removeConnection(playerId) {
    connections.delete(playerId);
  }

  return {
    addConnection,
    getConnection,
    removeConnection,
  };
};

module.exports = { create_connection_cache };
