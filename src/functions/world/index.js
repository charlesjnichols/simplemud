/**
 * @module functions
 *
 * Central export for world-level utilities like occupant detection and broadcasting.
 *
 * @exports get_occupants
 * @exports broadcast
 */

const get_occupants = require('./get-occupants');
const broadcast = require('./broadcast');

const is_alive = (actor) => actor.hp > 0;

module.exports = {
  get_occupants,
  is_alive,
  ...broadcast,
};
