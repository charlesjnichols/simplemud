/**
 * Utility functions for player behavior modules.
 *
 * @module player/utils
 */

/**
 * Attaches all functions from a behavior module to a player object.
 * Each function is wrapped so that `player` is automatically passed
 * as the first argument when the function is called.
 *
 * This is used in `create-player.js` to modularly extend the player object.
 *
 * @param {object} target - The target object to attach behaviors to.
 * @param {object} behaviorModule - A module exporting behavior functions.
 */
function attach_behaviors(target, behaviorModule) {
  for (const [key, fn] of Object.entries(behaviorModule)) {
    target[key] = (...args) => fn(target, ...args);
  }
}

module.exports = {
  attach_behaviors,
};
