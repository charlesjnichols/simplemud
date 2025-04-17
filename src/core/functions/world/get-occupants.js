/**
 * @module world/get_occupants
 *
 * Utility to retrieve all active playerRepository and living enemyRepository in a given room.
 *
 * @typedef {import('../../../models/player').Player} Player
 * @typedef {import('../../../models/enemy').Enemy} Enemy
 * @typedef {import('../../repository/player-repository')} PlayerRepository
 * * @typedef {import('../../repository/enemy-repository')} EnemyRepository
 */

'use strict';

/**
 * Returns a list of playerRepository and living enemyRepository occupying a given room.
 *
 * @param {number|string} room_id - The ID of the room to query.
 * @param {{
 *   playerRepository: PlayerRepository,
 *   enemyRepository: EnemyRepository
 * }} deps - Repositories used to look up room occupants.
 *
 * @returns {{
 *   playerRepository: Player[],
 *   enemyRepository: Enemy[]
 * }} Object containing the list of playerRepository and enemyRepository in the room.
 */
function get_occupants(room_id, { playerRepository, enemyRepository }) {
  return {
    playerRepository: playerRepository.find_by_room(room_id),
    enemyRepository: enemyRepository.values().filter((e) => e.room === room_id && e.is_alive()),
  };
}

module.exports = get_occupants;
