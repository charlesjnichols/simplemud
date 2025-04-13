const { Attribute } = require('../../attributes');
const { tostring } = require('../../utils/strings');
const { printSection, redBold, whiteBold, cyanBold, green, red, yellow } = require('../../utils/formatting');

module.exports = (player) => {
  const attr = player.GetAttr.bind(player);

  const identity = [
    whiteBold('Name:') + ' ' + cyanBold(player.name),
    whiteBold('HP/Max:') +
      ' ' +
      redBold(player.hitPoints) +
      '/' +
      red(attr(Attribute.get('Attribute.MAXHITPOINTS'))) +
      ` (${redBold(Math.round((100 * player.hitPoints) / attr(Attribute.get('Attribute.MAXHITPOINTS')) || 1))}%)`,
  ];

  const experience = [
    whiteBold('Level:') + ' ' + cyanBold(player.level),
    whiteBold('Experience:') +
      ' ' +
      green(player.experience) +
      '/' +
      green(player.needForLevel(player.level + 1)) +
      ` (${green(Math.round((100 * player.experience) / (player.needForLevel(player.level + 1) || 1)))}%)`,
  ];

  const attributes = [
    whiteBold('Strength:') + ' ' + yellow(tostring(attr(Attribute.get('STRENGTH')))),
    whiteBold('Accuracy:') + ' ' + yellow(tostring(attr(Attribute.get('ACCURACY')))),
    whiteBold('Dodging:') + ' ' + yellow(tostring(attr(Attribute.get('DODGING')))),
    whiteBold('Agility:') + ' ' + yellow(tostring(attr(Attribute.get('AGILITY')))),
    whiteBold('Strike Damage:') + ' ' + yellow(tostring(attr(Attribute.get('STRIKEDAMAGE')))),
    whiteBold('StatPoints:') + ' ' + yellow(tostring(player.statPoints)),
    whiteBold('Damage Absorb:') + ' ' + yellow(tostring(attr(Attribute.get('DAMAGEABSORB')))),
  ];

  const lines = [
    printSection(cyanBold('Your Stats'), identity, { bottom: false }) +
      printSection(cyanBold('Your Experience'), experience, { bottom: false }) +
      printSection(cyanBold('Your Attributes'), attributes),
  ];

  player.send(lines.join('\r\n'));
};
