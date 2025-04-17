const { send, needForLevel } = require('../../functions/player');
const { printSection, redBold, whiteBold, cyanBold, green, red, yellow } = require('../../utils/formatting');

module.exports = (player) => {
  const identity = [
    whiteBold('Name:') + ' ' + cyanBold(player.name),
    whiteBold('HP/Max:') +
      ' ' +
      redBold(player.hp) +
      '/' +
      red(player.maxHp) +
      ` (${redBold(Math.round((100 * player.hp) / player.maxHp || 1))}%)`,
  ];

  const experience = [
    whiteBold('Level:') + ' ' + cyanBold(player.level),
    whiteBold('Experience:') +
      ' ' +
      green(player.experience) +
      '/' +
      green(needForLevel(player, player.level + 1)) +
      ` (${green(Math.round((100 * player.experience) / (needForLevel(player, player.level + 1) || 1)))}%)`,
  ];

  const attributes = [
    whiteBold('Strength:') + ' ' + yellow(player.attributes.STRENGTH),
    whiteBold('Intelligence:') + ' ' + yellow(player.attributes.INTELLIGENCE),
    whiteBold('Dexterity:') + ' ' + yellow(player.attributes.DEXTERITY),
  ];

  const lines = [
    printSection(cyanBold('Your Stats'), identity, { bottom: false }) +
      printSection(cyanBold('Your Experience'), experience, { bottom: false }) +
      printSection(cyanBold('Your Attributes'), attributes),
  ];

  send(player, lines.join('\r\n'));
};
