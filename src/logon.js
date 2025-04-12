'use strict';

const Game = require('./game');
const createCreateCharacter = require('./player/player-login');
const createPlayer = require('./player/player');
const { v4: uuidv4 } = require('uuid');

const State = {
  ENTER_NAME: 'enter-name',
  ENTER_PASSWORD: 'enter-password',
  ENTER_NEW_PASSWORD: 'enter-new-password',
};

const createLogonHandler = ({connection, playerDb}) => {
  const state = { value: State.ENTER_NAME };
  const context = {
    name: '',
    numErrors: 0,
    isNewPlayer: false,
  };

  function enter() {
    connection.sendMessage("<bold><green>What is your name? </green></bold>");
  }

  function handle(input) {
    const data = input.trim();

    if (++context.numErrors > 5) {
      connection.sendMessage("<red><bold>Too many failed attempts. Disconnecting.</bold></red>");
      connection.close();
      return;
    }

    if (state.value === State.ENTER_NAME) {
      if (!isValidName(data)) {
        connection.sendMessage("<red><bold>Invalid name. Try again: </bold></red>");
        return;
      }

      context.name = data;
      const existing = playerDb.findByNameFull(context.name);

      if (existing) {
        connection.sendMessage("<green>Welcome back! Enter your password: </green>");
        state.value = State.ENTER_PASSWORD;
      } else {
        connection.sendMessage("<green>New player detected. Create a password: </green>");
        state.value = State.ENTER_NEW_PASSWORD;
        context.isNewPlayer = true;
      }

      return;
    }

    if (state.value === State.ENTER_PASSWORD) {
      const player = playerDb.findByNameFull(context.name);
      if (!player || player.password !== data) {
        connection.sendMessage("<red><bold>Incorrect password. Try again:</bold></red>");
        return;
      }

      player.connection = connection;
      
      connection.removeHandler();
      connection.addHandler(new Game(connection, player));
      return;
    }

    if (state.value === State.ENTER_NEW_PASSWORD) {
      if (!data || data.includes(' ')) {
        connection.sendMessage("<red><bold>Invalid password. Try again:</bold></red>");
        return;
      }

      const player = createPlayer({
        name: context.name,
        password: data,
        connection: connection,
        id: uuidv4(),
      });

      playerDb.addPlayer(player);

      connection.sendMessage("<green>Character created! Starting character creation...</green>");
      connection.removeHandler();
      connection.addHandler(createCreateCharacter(player));
    }
  }

  function leave() { }
  function hungup() {
    console.log(`[Logon] Disconnected: ${context.name || 'unknown user'}`);
  }

  return {
    enter,
    handle,
    leave,
    hungup,
  };
}

// Helpers
function isValidName(name) {
  return /^[a-zA-Z0-9]{3,20}$/.test(name);
}

module.exports = {
  createLogonHandler
};
