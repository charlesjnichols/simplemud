'use strict';

const Game = require('./game-handler');
const { create_character_handler } = require('./character-creater-handler');
const { create_player } = require('../../functions/player/create-player');
const { v4: uuidv4 } = require('uuid');
const { decryptPassword, isEncrypted } = require('../../../utils/password-vault');

const State = {
  ENTER_NAME: 'enter-name',
  ENTER_PASSWORD: 'enter-password',
  ENTER_NEW_PASSWORD: 'enter-new-password',
};

const create_logon_handler = (connection) => {
  const { playerRepository, connectionRepository } = require('../../datastores').get();
  const { eventBus } = require('../../game-bus').get();

  const state = { value: State.ENTER_NAME };
  const context = {
    name: '',
    numErrors: 0,
    isNewPlayer: false,
  };

  function enter() {
    connection.sendMessage('<bold><green>What is your name? </green></bold>');
  }

  function handle(input) {
    const data = input.trim();

    if (++context.numErrors > 5) {
      connection.sendMessage('<red><bold>Too many failed attempts. Disconnecting.</bold></red>');
      connection.close();
      return;
    }

    if (state.value === State.ENTER_NAME) {
      if (!isValidName(data)) {
        connection.sendMessage('<red><bold>Invalid name. Try again: </bold></red>');
        return;
      }

      context.name = data;
      const existing = playerRepository.load_by_name(context.name);

      if (existing) {
        connection.sendMessage('<green>Welcome back! Enter your password: </green>');
        state.value = State.ENTER_PASSWORD;
      } else {
        connection.sendMessage('<green>New player detected. Create a password: </green>');
        state.value = State.ENTER_NEW_PASSWORD;
        context.isNewPlayer = true;
      }

      return;
    }

    if (state.value === State.ENTER_PASSWORD) {
      const player = playerRepository.load_by_name(context.name);
      const isMatch =
        player &&
        ((!isEncrypted(player.password) && player.password === data) || decryptPassword(player.password) === data);

      if (!isMatch) {
        connection.sendMessage('<red><bold>Incorrect password. Try again:</bold></red>');
        return;
      }

      playerRepository.add(player);
      connectionRepository.addConnection(player.id, connection);

      eventBus.emit('player.login.success', { player });

      connection.removeHandler();
      connection.addHandler(new Game(connection, player));
      return;
    }

    if (state.value === State.ENTER_NEW_PASSWORD) {
      if (!data || data.includes(' ')) {
        connection.sendMessage('<red><bold>Invalid password. Try again:</bold></red>');
        return;
      }

      const player = create_player({
        id: uuidv4(),
        name: context.name,
        password: data,
      });

      playerRepository.add(player);
      connectionRepository.addConnection(player.id, connection);

      connection.sendMessage('<green>Character created! Starting character creation...</green>');
      connection.removeHandler();
      connection.addHandler(create_character_handler(connection, player));
    }
  }

  function leave() {}
  function hungup() {
    console.log(`[Logon] Disconnected: ${context.name || 'unknown user'}`);
  }

  return {
    enter,
    handle,
    leave,
    hungup,
  };
};

// Helpers
function isValidName(name) {
  return /^[a-zA-Z0-9]{3,20}$/.test(name);
}

module.exports = {
  create_logon_handler,
};
