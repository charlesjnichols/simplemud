/**
 * @module commands/movement/movement-alias
 *
 * Maps movement aliases (e.g., "n", "north") to their corresponding direction command files.
 * Provides utility functions to validate and resolve movement command handlers.
 */

/**
 * List of direction definitions with their aliases and command file paths.
 *
 * @type {{ keys: string[], file: string }[]}
 */
const directions = [
  { keys: ['n', 'north'], file: './movement/north.js' },
  { keys: ['s', 'south'], file: './movement/south.js' },
  { keys: ['e', 'east'], file: './movement/east.js' },
  { keys: ['w', 'west'], file: './movement/west.js' },
];

/**
 * A lookup map of movement aliases to their corresponding file paths.
 *
 * @type {Record<string, string>}
 */
const directionMap = directions.reduce((acc, { keys, file }) => {
  keys.forEach((k) => {
    acc[k] = file;
  });
  return acc;
}, /** @type {Record<string, string>} */ ({}));

/**
 * Determines whether a given verb is a recognized direction alias.
 *
 * @param {string} verb - The command word to check (e.g., "n", "north").
 * @returns {boolean} True if the verb is a direction alias, false otherwise.
 */
function is_direction(verb) {
  return Object.prototype.hasOwnProperty.call(directionMap, verb);
}

/**
 * Resolves the file path for a given direction alias.
 *
 * @param {string} verb - The direction alias (e.g., "n", "east").
 * @returns {string | undefined} The path to the movement command file, or undefined if not found.
 */
function get_command_function(verb) {
  return directionMap[verb];
}

module.exports = {
  is_direction,
  get_command_function,
};
