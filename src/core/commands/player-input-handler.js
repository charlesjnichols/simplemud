const dispatchCommand = require('./command-dispatcher');

const { PlayerRank } = require('../../utils/enums');

const { is_in_store } = require('../functions/room');

const { roomRepository } = require('../datastores').get();

const create_input = () => {
  return (player, input) => {
    const [verb, ...args] = input.trim().split(/\s+/);
    const contexts = [];

    // Determine contexts based on player's state
    const room = roomRepository.get(player.room);
    if (is_in_store(room)) {
      contexts.push('store');
    }
    if (player.rank === PlayerRank.ADMIN) {
      contexts.push('admin');
    }
    contexts.push('global');
    contexts.push('movement');

    dispatchCommand(contexts, verb.toLowerCase(), args, player);
  };
};
module.exports = {
  create_input,
};
