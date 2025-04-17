const { resolveAttack } = require('./resolve-attack');
const { is_alive } = require('../world');

const perform_auto_attack = (attacker, target, timeNow) => {
  if (!is_alive(attacker) || !is_alive(target)) return;

  const attackSpeed = attacker.weapon?.speed || 1000;

  resolveAttack(attacker, target);
  attacker.nextAttackTime = timeNow + attackSpeed;
};

module.exports = {
  perform_auto_attack,
};
