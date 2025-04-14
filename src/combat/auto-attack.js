const { resolveAttack } = require('./resolve-attack');
const { sendCombatMessage } = require('./messages');

const performAutoAttack = (attacker, target, timeNow, databases) => {
  if (!attacker.isAlive() || !target.isAlive()) return;

  const weapon = attacker.getWeapon?.();
  const attackSpeed = weapon?.speed || 1000;

  const result = resolveAttack(attacker, target, databases);
  sendCombatMessage(attacker, target, result);
  attacker.nextAttackTime = timeNow + attackSpeed;
};

module.exports = {
  performAutoAttack,
};
