const { red, white, cyanBold } = require('../utils/formatting');

module.exports = {
  miss: (attacker, target) => white(`${attacker} swings at ${target} but misses!`),
  hit: (attacker, target, dmg) => red(`${attacker} hits ${target} for ${dmg} damage!`),
  death: (name) => cyanBold(`${name} has died!`),
};
