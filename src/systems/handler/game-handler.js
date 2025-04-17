'use strict';

const ConnectionHandler = require('../../connections/connection-handler');
const { command_router } = require('../../commands/command-contexts');
const { eventBus } = require('../../events/event-bus').get();

// Game Handler class
class Game extends ConnectionHandler {
  constructor(connection, player) {
    super(connection);
    this.player = player;
    this.handlePlayerInput = command_router;
  }

  enter() {
    eventBus.emit('player.enteredRealm', { player: this.player });
  }

  handle(input) {
    this.handlePlayerInput(this.player, input);
  }

  leave() {
    eventBus.emit('player.leftRealm', { player: this.player });
  }

  hungup() {
    eventBus.emit('player.leftRealm', { player: this.player });
  }
}

module.exports = Game;
