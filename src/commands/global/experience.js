const { printSection, printTwoCol } = require('../../utils/formatting');

module.exports = (player) => {
  const nextXP = player.needForLevel(player.level + 1);
  const percent = Math.round((100 * player.experience) / nextXP);

  const experience = [
    printTwoCol('Level:', player.level),
    printTwoCol('Experience:', `${player.experience}/${nextXP} (${percent}%)`)
  ];
  player.send(printSection('Your Experience', experience));
};
