const { redBold, whiteBold, cyanBold, yellow } = require('../utils/formatting');

module.exports = {
  death: () => redBold('You have died!'),
  resurrect: (roomName) => whiteBold(`You have died, but have been resurrected in ${roomName}`),
  xpLoss: (amount) => redBold(`You have lost ${amount} experience!`),
  xpGain: (amount) => cyanBold(`You gain ${amount} experience.`),
  reappear: (name) => whiteBold(`${name} appears out of nowhere!!`),
  whisperTo: (to, msg) => yellow(`You whisper to ${to}: `) + `${msg}`,
  whisperFrom: (from, msg) => yellow(`${from} whispers to you: `) + `${msg}`,
};
