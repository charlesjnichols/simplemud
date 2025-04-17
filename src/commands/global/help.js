const { cyan } = require('../../utils/formatting');
const { send } = require('../../functions/player');

module.exports = (player, args) => {
  if (!args || args.length === 0) {
    return send(
      player,
      [
        'Available commands:',
        `- ${cyan('look')}`,
        `- ${cyan('say')}`,
        `- ${cyan('help')}`,
        `- ${cyan('inventory')}`,
        `- ${cyan('list')}`,
        '',
        "Type 'help <command>' for more info.",
      ].join('\n'),
    );
  }

  const topic = args[0].toLowerCase();
  switch (topic) {
    case 'look':
      return send(player, `${cyan('look')} shows you what's in the room.`);
    case 'say':
      return send(player, `${cyan('say')} lets you speak to other playerRepository in the room.`);
    case 'list':
      return send(player, `${cyan('list')} shows what the store has for sale.`);
    default:
      return send(player, `No help available for '${topic}'.`);
  }
};
