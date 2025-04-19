/**
 * @module utils/input
 *
 * Provides a utility to resolve partial string inputs into defined options.
 * Supports exact match, prefix matching, and ambiguity detection.
 */

/**
 * Resolves a string input against a set of allowed options.
 *
 * @param {string} input - The raw user input string (e.g., from a command or argument).
 * @param {Record<string, string>} options - A map of valid option keys and their corresponding canonical values.
 *
 * @returns {string | null} - The resolved value if uniquely matched, `"AMBIGUOUS"` if multiple matches found, or `null` if no match.
 */
function resolveInput(input, options) {
  input = input.toLowerCase().trim();

  if (options[input]) return options[input];

  const values = Object.values(options);
  const matches = values.filter((value) => value.startsWith(input));
  const unique = [...new Set(matches)];

  if (unique.length === 1) return unique[0];
  if (unique.length > 1) return 'AMBIGUOUS';

  return null;
}

module.exports = { resolveInput };
