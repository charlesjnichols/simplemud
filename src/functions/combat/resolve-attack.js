/**
 * @module src/functions/combat/resolve-attack.js
 *
 * Handles logic for resolving an attack between two combatants.
 *
 * @typedef {import('../../models/mob').Mob} Mob
 * @typedef {import('../../models/player').Player} Player
 */

const { ActorType, AttackResult } = require('../../config');
const { cyan } = require('../../utils/formatting');
const { send_to_room } = require('../world');
const { calculateDamage } = require('./damage');
const { sendCombatMessage } = require('./messages');

const debug = require('debug')('mud:combat:resolve-attack');

/**
 * Resolves a single combat action from attacker to target.
 *
 * Performs a hit chance roll, calculates and applies damage,
 * emits death events if the target is defeated, and returns combat summary.
 *
 * @param {Player|Mob} attacker - The entity initiating the attack.
 * @param {Player|Mob} target - The entity being attacked.
 *
 * @returns {void}
 */
const resolveAttack = (attacker, target) => {
  // Simple hit chance logic (expandable)
  const hitRoll = Math.random();
  const hitChance = 0.85;

  if (hitRoll > hitChance) {
    sendCombatMessage(attacker, target, { type: AttackResult.MISS });
  }

  const damage = calculateDamage(attacker, target);
  target.hp -= damage;

  sendCombatMessage(attacker, target, { type: AttackResult.HIT, damage });
  send_to_room(attacker, cyan(`${target.name} now has ${target.hp} HP!!`));

  if (target.hp <= 0) {
    handleDeath(attacker, target);
  }
};

/**
 * Emits the appropriate death event depending on the type of the target.
 *
 * @param {Player|Mob} attacker - The entity who dealt the killing blow.
 * @param {Player|Mob} target - The entity who died.
 *
 * @returns {void}
 */
const handleDeath = (attacker, target) => {
  const { eventBus } = require('../../events/event-bus').get();

  if (target.type === ActorType.PLAYER) {
    debug(`${target.name} (player) has died.`);
    eventBus.emit('player.died', { attacker, player: target });
  } else if (target.type === ActorType.MOB) {
    debug(`${target.name} (mob) has died.`);
    eventBus.emit('mob.died', { attacker, mob: target });
  }
};

module.exports = {
  resolveAttack,
  handleDeath,
};
