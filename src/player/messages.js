const { Attribute, PlayerRank } = require('../attributes');
const { tostring } = require('../utils/strings');
const {
  padRight,
  printSection,
  printTwoCol,
  redBold,
  whiteBold,
  cyanBold,
  divider,
  green,
  red,
  yellow,
  white,
} = require('../utils/formatting');

const createPlayerMessages = (player) => {
  const printWhoList = (mode, playerDb) => {
    const filterFn = mode === 'all' ? () => true : (p) => p.loggedIn;

    const header = whiteBold('NAME              | LEVEL     | STATUS    | RANK');
    const rows = playerDb
      .values()
      .filter(filterFn)
      .map((p) => {
        const name = padRight(p.name, 18);
        const level = padRight(p.level.toString(), 10);
        const status = p.active ? green('Online   ') : p.loggedIn ? yellow('Inactive ') : red('Offline  ');

        const rankColor = p.rank === PlayerRank.ADMIN ? green : p.rank === PlayerRank.GOD ? yellow : white;

        const rank = rankColor(p.rank.toString());

        return `${name}| ${level}| ${status}| ${rank}`;
      });

    return printSection('WHO', [header, divider(), ...rows]);
  };

  return {
    death: () => redBold('You have died!'),
    resurrect: (roomName) => whiteBold(`You have died, but have been resurrected in ${roomName}`),
    xpLoss: (amount) => redBold(`You have lost ${amount} experience!`),
    xpGain: (amount) => cyanBold(`You gain ${amount} experience.`),
    reappear: (name) => whiteBold(`${name} appears out of nowhere!!`),
    whisperTo: (to, msg) => yellow(`You whisper to ${to}: `) + `${msg}`,
    whisperFrom: (from, msg) => yellow(`${from} whispers to you: `) + `${msg}`,
    printWhoList,
  };
};

module.exports = {
  createPlayerMessages,
};
