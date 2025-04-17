const { yellow, redBold } = require('../../utils/formatting');
const { send_to_room } = require('../world');

const sendCombatMessage = (attacker, target, result) => {
  const { type, damage } = result;

  if (type === 'miss') {
    send_to_room(attacker, `${yellow(attacker.name)} swings at ${yellow(target.name)} but ${redBold('misses')}.`);
    return;
  }

  if (type === 'hit') {
    send_to_room(attacker, `${yellow(attacker.name)} hits ${yellow(target.name)} for ${redBold(damage)} damage.`);
    return;
  }
};

module.exports = {
  sendCombatMessage,
};
