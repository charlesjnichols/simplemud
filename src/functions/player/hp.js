/**
 * Hit point (HP) management behaviors for a player.
 *
 * These functions are meant to be attached to the player using `attachBehaviors()`,
 * which binds the player instance as the first argument.
 *
 * @module player/hp
 */

/**
 * Sets the player's current HP to a bounded value between 0 and max HP.
 *
 * @param {object} player - The player object.
 * @param {number} hp - The new HP value to assign.
 */
function setHitPoints(player, hp) {
  player.hp = Math.max(0, Math.min(hp, player.maxHp));
}

/**
 * Increases the player's current HP by a specified amount,
 * without exceeding max HP.
 *
 * @param {object} player - The player object.
 * @param {number} hp - The amount of HP to add (can be negative).
 */
function addHitPoints(player, hp) {
  setHitPoints(player, player.hp + hp);
}

/**
 * Determines whether the player is currently alive.
 *
 * @param {object} player - The player object.
 * @returns {boolean} True if the player's HP is greater than 0.
 */
function isAlive(player) {
  return player.hp > 0;
}

module.exports = {
  setHitPoints,
  addHitPoints,
  isAlive,
};
