/**
 * Leveling and experience-related behaviors for a player.
 *
 * These functions are meant to be attached using `attachBehaviors()`,
 * which binds the player object as the first argument.
 *
 * @module player/leveling
 */

/**
 * Calculates the total XP needed to reach a specific level.
 * Uses an exponential formula: `100 * (1.4^(level - 1) - 1)`
 *
 * @param {object} player - The player object (not used but required for attachBehaviors compatibility).
 * @param {number} level - The target level.
 * @returns {number} The total XP needed to reach the given level.
 */
function needForLevel(player, level) {
  return Math.round(100 * (Math.pow(1.4, level - 1) - 1));
}

/**
 * Calculates the remaining XP the player needs to reach their next level.
 *
 * @param {object} player - The player object.
 * @returns {number} The amount of XP needed to reach the next level.
 */
function needForNextLevel(player) {
  return needForLevel(player, player.level + 1) - player.experience;
}

module.exports = {
  needForLevel,
  needForNextLevel,
};
