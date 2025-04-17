const { send } = require('../../functions/player');
const { printSection } = require('../../../utils/formatting');

module.exports = (player) => {
  const nextXP = player.needForLevel(player.level + 1);
  const percent = Math.round((100 * player.experience) / nextXP);

  const experience = ['Level: ' + player.level, 'Experience:' + `${player.experience}/${nextXP} (${percent}%)`];
  send(player, printSection('Your Experience', experience));
};
