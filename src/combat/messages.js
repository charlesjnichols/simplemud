const { grey, yellow, red, redBold, magenta } = require('../utils/formatting');
const { sendRoom } = require('../game/broadcast');

const sendCombatMessage = (attacker, target, result) => {
  const { type, damage } = result;

  if (type === 'miss') {
    sendRoom(attacker.room, [`${yellow(attacker.name)} swings at ${yellow(target.name)} but ${redBold('misses')}.`]);
    return;
  }

  if (type === 'hit') {
    sendRoom(attacker.room, `${yellow(attacker.name)} hits ${yellow(target.name)} for ${redBold(damage)} damage.`);

    if (target.hp <= 0) {
      sendRoom(attacker.room, [`${yellow(target.name)} ${magenta('has been defeated!')}`]);
    }

    return;
  }
};

module.exports = {
  sendCombatMessage,
};
