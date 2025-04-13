const { PlayerRank } = require('../../attributes');
const dispatchCommand = require('./dispatcher');

const createInput = (databases) => (player, input) => {
  const [verb, ...args] = input.trim().split(/\s+/);
  const contexts = [];

  // Determine contexts based on player's state
  if (player.isInStore()) contexts.push('store');
  if (player.rank === PlayerRank.get('ADMIN')) contexts.push('admin');
  contexts.push('movement');
  contexts.push('global');

  dispatchCommand(contexts, verb.toLowerCase(), args, player, databases);
};

module.exports = {
  createInput,
};
