'use strict';

const ConnectionHandler = require('../../connection/connection-handler');
const { create_input } = require('../../commands/player-input-handler');
const { eventBus } = require('../../game-bus').get();

// Game Handler class
class Game extends ConnectionHandler {
  constructor(connection, player) {
    super(connection);
    this.player = player;
    this.handlePlayerInput = create_input();
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
