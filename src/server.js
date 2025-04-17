'use strict';

const net = require('net');
const Telnet = require('./utils/telnet');

const log = require('debug')('mud:server:main');
const connect = require('debug')('mud:server:connect');
const error = require('debug')('mud:server:error');

require('./core/datastores').load();
require('./core/game-bus').init();

const { create_game_loop } = require('./core/game/game-loop');
const { create_connection_manager } = require('./core/connection/connection-manager');

const PORT = parseInt(process.argv[2]) || 3000;
const HOST = process.argv[3] || '0.0.0.0';

const gameLoop = create_game_loop();
const connectionManager = create_connection_manager();

gameLoop.start();

const server = net.createServer((socket) => {
  connect(`New connection from ${socket.remoteAddress}:${socket.remotePort}`);
  connectionManager.newConnection(socket, Telnet);
});

server.on('error', (err) => {
  error(`Server error: ${err.message}`);
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  log(`🚪 SimpleMUD server listening on ${HOST}:${PORT}`);
  log(`Use a Telnet client to connect:\n  telnet <your-ip> ${PORT}`);
});
