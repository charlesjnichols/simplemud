/**
 * @module src/connections/connection-manager.js
 *
 * Provides a factory for managing live player connections, including binding players to connections,
 * creating new sessions, and cleaning up closed sockets.
 */

'use strict';

const connection = require('./connection');
const { create_logon_handler } = require('../states/login');

/**
 * Creates a connection manager for handling player sessions.
 *
 * @returns {{
 *   getConnection: (index: number) => any,
 *   newConnection: (socket: any, handler?: any) => void,
 *   bindPlayerToConnection: (playerId: string, connection: any) => void,
 *   closeConnection: (socket: any) => void,
 *   removeConnection: (socket: any) => void,
 *   totalConnections: () => number,
 *   findConnection: (socket: any) => any
 * }}
 */
const create_connection_manager = () => {
  const { connectionRepository } = require('../repository/repositories').get();

  /** @type {any[]} */
  const connections = [];

  /**
   * Returns the connection at a given index.
   *
   * @param {number} index
   * @returns {any}
   */
  const getConnection = (index) => {
    return connections[index];
  };

  /**
   * Creates a new connection and assigns a default handler.
   *
   * @param {any} socket - The raw socket for the connection.
   * @param {any} [handler] - Optional custom handler to set instead of default login.
   */
  const newConnection = (socket, handler) => {
    const conn = new connection(socket);

    const defaultHandler = handler || create_logon_handler(conn);
    conn.addHandler(defaultHandler);

    connections.push(conn);
    socket.on('close', () => removeConnection(socket));
  };

  /**
   * Associates a player ID with a connection in the repository.
   *
   * @param {string} playerId
   * @param {any} connection
   */
  const bindPlayerToConnection = (playerId, connection) => {
    connection.playerId = playerId;
    connectionRepository.addConnection(playerId, connection);
  };

  /**
   * Closes a connection and removes it from the repository.
   *
   * @param {any} socket
   */
  const closeConnection = (socket) => {
    const conn = findConnection(socket);
    if (conn?.playerId) {
      connectionRepository.removeConnection(conn.playerId);
    }
    conn.socket.end();
  };

  /**
   * Removes a connection from the internal list without triggering disconnect logic.
   *
   * @param {any} socket
   */
  const removeConnection = (socket) => {
    const conn = findConnection(socket);
    const index = connections.indexOf(conn);
    if (index !== -1) connections.splice(index, 1);
  };

  /**
   * Returns the total number of active connections.
   *
   * @returns {number}
   */
  const totalConnections = () => {
    return connections.length;
  };

  /**
   * Finds a connection by its socket reference.
   *
   * @param {any} socket
   * @returns {any}
   */
  const findConnection = (socket) => {
    const conn = connections.filter((conn) => conn.socket === socket);
    return conn.length ? conn[0] : 0;
  };

  return {
    getConnection,
    newConnection,
    bindPlayerToConnection,
    closeConnection,
    removeConnection,
    totalConnections,
    findConnection,
  };
};

module.exports = {
  create_connection_manager,
};
