/**
 * Shared constants used in player logic.
 *
 * @module player/constants
 */

/**
 * Minimum time (in milliseconds) between automatic statbar updates.
 * Used to avoid spamming the client with redundant HP updates.
 *
 * @type {number}
 */
const STATBAR_INTERVAL_MS = 5000;

module.exports = {
  STATBAR_INTERVAL_MS,
};
