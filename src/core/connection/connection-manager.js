'use strict';

const connection = require('./connection');
const { create_logon_handler } = require('../game/handler/logon-handler');

const create_connection_manager = () => {
  const { connectionRepository } = require('../datastores').get();

  const connections = [];

  const getConnection = (index) => {
    return connections[index];
  };

  const newConnection = (socket, protocol, bus, handler) => {
    const conn = new connection(socket, protocol);

    const defaultHandler = handler || create_logon_handler(conn);
    conn.addHandler(defaultHandler);

    connections.push(conn);
    socket.on('close', () => removeConnection(socket));
  };

  const bindPlayerToConnection = (playerId, connection) => {
    connection.playerId = playerId;
    connectionRepository.addConnection(playerId, connection);
  };

  const closeConnection = (socket) => {
    const conn = findConnection(socket);
    if (conn?.playerId) {
      connectionRepository.removeConnection(conn.playerId);
    }
    conn.socket.end();
  };

  const removeConnection = (socket) => {
    const conn = findConnection(socket);
    const index = connections.indexOf(conn);
    if (index !== -1) connections.splice(index, 1);
  };

  const totalConnections = () => {
    return connections.length;
  };

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
