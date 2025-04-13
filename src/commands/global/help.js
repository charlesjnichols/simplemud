const { cyan } = require('../../utils/formatting');

module.exports = (player, args) => {
  if (!args || args.length === 0) {
    return player.send(
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
      return player.send(`${cyan('look')} shows you what's in the room.`);
    case 'say':
      return player.send(`${cyan('say')} lets you speak to other players in the room.`);
    case 'list':
      return player.send(`${cyan('list')} shows what the store has for sale.`);
    default:
      return player.send(`No help available for '${topic}'.`);
  }
};
