'use strict';

const ConnectionHandler = require('../../connection/handler');
const { createInput } = require('../input/player');
const { sendToLoggedInPlayers } = require('../broadcast');

// Game Handler class
class Game extends ConnectionHandler {
  constructor(connection, player, databases) {
    super(connection);
    this.player = player;
    this.handlePlayerInput = createInput(databases);
  }

  enter() {
    this.player.controller.enter();
  }

  handle(input) {
    this.handlePlayerInput(this.player, input);
  }

  leave() {
    this.player.controller.leave();
  }

  // ------------------------------------------------------------------------
  //  This notifies the handler that a connection has unexpectedly hung up.
  // ------------------------------------------------------------------------
  hungup() {
    sendToLoggedInPlayers(this.player.playerDb, `${this.player.name} has suddenly disappeared from the realm.`);
  }
}

module.exports = Game;
