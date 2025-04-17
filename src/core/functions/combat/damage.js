const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
const calculateDamage = (attacker, target) => {
  if (attacker.isPlayer) return 100;

  const weapon = attacker.getWeapon?.();
  const baseMin = weapon?.minDamage || 1;
  const baseMax = weapon?.maxDamage || 4;

  const baseDamage = _.random(baseMin, baseMax);

  //   const strengthMod = Math.floor((attacker.strength || 0) * 0.5);
  //   const defense = target.defense || 0;
  //   const totalDamage = Math.max(baseDamage + strengthMod - defense, 0);
  return baseDamage;
};

module.exports = {
  calculateDamage,
};
