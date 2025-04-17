const { ActorType } = require('../../../utils/enums');
const { cyan } = require('../../../utils/formatting');
const { send_to_room } = require('../world');
const { calculateDamage } = require('./damage');
const { sendCombatMessage } = require('./messages');

const debug = require('debug')('mud:combat:resolve-attack');

const resolveAttack = (attacker, target) => {
  const attackerName = attacker.name || 'Unknown';
  const targetName = target.name || 'Unknown';

  // Simple hit chance logic (expand later with agility, evasion, etc.)
  const hitRoll = Math.random();
  const hitChance = 0.85;

  if (hitRoll > hitChance) {
    sendCombatMessage(attacker, target, { type: 'miss' });
  }

  const damage = calculateDamage(attacker, target);
  target.hp -= damage;

  sendCombatMessage(attacker, target, { type: 'hit', damage });
  send_to_room(attacker, cyan(`${target.name} now has ${target.hp} HP!!`));

  if (target.hp <= 0) {
    handleDeath(attacker, target);
  }

  return {
    type: 'hit',
    attacker: attackerName,
    target: targetName,
    damage,
  };
};

const handleDeath = (attacker, target) => {
  const { eventBus } = require('../../game-bus').get();

  if (target.type == ActorType.PLAYER) {
    debug(`${target.name} (player) has died.`);
    eventBus.emit('player.died', { attacker, player: target });
  } else if (target.type == ActorType.ENEMY) {
    debug(`${target.name} (enemy) has died.`);
    eventBus.emit('enemy.died', { attacker, enemy: target });
  }
};

module.exports = {
  resolveAttack,
  handleDeath,
};
