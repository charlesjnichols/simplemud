const { route_command } = require('./command-router');
const { PlayerRank } = require('../config');
const { is_in_store } = require('../functions/room');
const { roomRepository } = require('../repository/repositories').get();

const command_contexts = (player, input) => {
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

  route_command(contexts, verb.toLowerCase(), args, player);
};

module.exports = {
  command_contexts,
};
