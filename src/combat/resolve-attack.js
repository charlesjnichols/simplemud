const { sendRoom } = require('../game/broadcast');
const { cyan } = require('../utils/formatting');
const { calculateDamage } = require('./damage');
const { handleDeath } = require('./death');

const resolveAttack = (attacker, target, databases) => {
  const attackerName = attacker.name || 'Unknown';
  const targetName = target.name || 'Unknown';

  // Simple hit chance logic (expand later with agility, evasion, etc.)
  const hitRoll = Math.random();
  const hitChance = 0.85;

  if (hitRoll > hitChance) {
    return {
      type: 'miss',
      attacker: attackerName,
      target: targetName,
      damage: 0,
    };
  }

  const damage = calculateDamage(attacker, target);

  target.addHitPoints(-damage);
  sendRoom(target.room, cyan(`${target.name} now has ${target.hitPoints} HP!!`));

  if (target.hitPoints <= 0) {
    handleDeath(attacker, target, databases);
  }

  return {
    type: 'hit',
    attacker: attackerName,
    target: targetName,
    damage,
  };
};

module.exports = {
  resolveAttack,
};
