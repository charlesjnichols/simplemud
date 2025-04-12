'use strict';

const connection = require('./connection');
const { createLogonHandler } = require('../logon');

const createConnectionManager = ({ playerDb }) => {
  const connections = [];

  const getConnection = (index) => {
    return connections[index];
  };

  const newConnection = (socket, protocol, handler) => {
    const conn = new connection(socket, protocol);
    const defaultHandler = handler || createLogonHandler({ connection: conn, playerDb });
    conn.addHandler(defaultHandler);
    connections.push(conn);
    socket.on('close', () => removeConnection(socket));
  };

  const closeConnection = (socket) => {
    const conn = findConnection(socket);
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
    closeConnection,
    removeConnection,
    totalConnections,
    findConnection,
  };
};

module.exports = {
  createConnectionManager,
};
