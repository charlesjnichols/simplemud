'use strict';

const Game = require('./game');
const { playerDb } = require('../../databases');
const { resolveInput } = require('../../utils/input');

const State = {
  CHOOSE_CLASS: 'choose-class',
  CONFIRM: 'confirm',
  DONE: 'done',
};

function createCreateCharacter(player) {
  const stateHolder = {
    state: State.CHOOSE_CLASS,
  };

  const classOptions = {
    warrior: 'warrior',
    w: 'warrior',
    war: 'warrior',
    mage: 'mage',
    m: 'mage',
    mag: 'mage',
    rogue: 'rogue',
    r: 'rogue',
    rog: 'rogue',
  };

  const enter = () => {
    player.connection.socket.write('\nWelcome, new adventurer!\nChoose your class (warrior, mage, rogue): ');
  };

  const handle = (input) => {
    const response = input.trim().toLowerCase();

    if (stateHolder.state === State.CHOOSE_CLASS) {
      const chosenClass = resolveInput(response, classOptions);

      if (!chosenClass) {
        player.connection.socket.write('Invalid class. Try warrior, mage, or rogue: ');
        return;
      }

      if (chosenClass === 'AMBIGUOUS') {
        player.connection.socket.write('Input is ambiguous. Please type more of the class name.\n');
        return;
      }

      player.class = chosenClass;
      stateHolder.state = State.CONFIRM;
      player.connection.socket.write('Character created! Press ENTER to begin your journey.\n');
      return;
    }

    if (stateHolder.state === State.CONFIRM) {
      initializePlayer(player);
      playerDb.addPlayer(player);
      stateHolder.state = State.DONE;
      player.connection.addHandler(new Game(player.connection, player));
    }
  };

  const initializePlayer = (p) => {
    p.level = 1;
    p.money = 10;
    p.room = 1;
  };

  const leave = () => {};
  const hungup = () => {
    console.log(`[Disconnected during character creation: ${player.name}]`);
  };

  return {
    enter,
    handle,
    leave,
    hungup,
  };
}

module.exports = createCreateCharacter;
