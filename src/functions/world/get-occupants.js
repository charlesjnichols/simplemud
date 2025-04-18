/**
 * @module world/get_occupants
 *
 * Utility to retrieve all active playerRepository and living mobRepository in a given room.
 *
 * @typedef {import('../../models/player').Player} Player
 * @typedef {import('../../../models/mob').Mob} Mob
 * @typedef {import('../../repository/player-repository')} PlayerRepository
 * * @typedef {import('../../repository/mob-repository')} mobRepository
 */

'use strict';

/**
 * Returns a list of playerRepository and living mobRepository occupying a given room.
 *
 * @param {number|string} room_id - The ID of the room to query.
 * @param {{
 *   playerRepository: PlayerRepository,
 *   mobRepository: mobRepository
 * }} deps - Repositories used to look up room occupants.
 *
 * @returns {{
 *   playerRepository: Player[],
 *   mobRepository: Mob[]
 * }} Object containing the list of playerRepository and mobRepository in the room.
 */
function get_occupants(room_id, { playerRepository, mobRepository }) {
  return {
    playerRepository: playerRepository.find_by_room(room_id),
    mobRepository: mobRepository.values().filter((e) => e.room === room_id && e.is_alive()),
  };
}

module.exports = get_occupants;
