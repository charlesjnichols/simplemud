'use strict';

const net = require('net');

const { createConnectionManager } = require('./connection/manager');
const GameLoop = require('./game-loop');
const Telnet = require('./telnet');

const databases = require('./databases');

const PORT = parseInt(process.argv[2]) || 3000;
const HOST = process.argv[3] || '0.0.0.0';

const server = net.createServer((socket) => {
  console.log(`[Connect] New connection from ${socket.remoteAddress}:${socket.remotePort}`);
  connectionManager.newConnection(socket, Telnet);
});

server.on('error', (err) => {
  console.error(`[Server Error] ${err.message}`);
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log(`\n🚪 SimpleMUD server listening on ${HOST}:${PORT}`);
  console.log('Use a Telnet client to connect, e.g.:');
  console.log(`  telnet <your-ip> ${PORT}\n`);
});

const gameLoop = new GameLoop(databases);
const connectionManager = createConnectionManager(databases);

setInterval(gameLoop.loop.bind(gameLoop), 1000);
