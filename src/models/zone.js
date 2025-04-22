/**
 * @typedef {import('../functions/zone/create-zone-map.js').Room} Room
 */

/**
 * @typedef {object} Zone
 *
 * Represents a procedural or static zone instance in the game world.
 *
 * @property {string} id - Unique identifier for this zone instance (e.g. 'zone-12345')
 * @property {string} seed - Seed used to generate the zone (ensures determinism)
 * @property {string} zoneName - The name of the zone (e.g. "Ruins of Serpent's Spine")
 * @property {number} createdAt - Timestamp of when the zone was generated
 * @property {Record<string, Room>} rooms - A map of room IDs to room objects
 */

/**
 * Creates a new Zone object.
 *
 * @param {{
 *   id: string,
 *   seed: string,
 *   zoneName: string,
 *   rooms: Record<string, Room>,
 *   createdAt?: number
 * }} params
 * @returns {Zone}
 */
const createZone = ({ id, seed, zoneName, rooms, createdAt = Date.now() }) => ({
  id,
  seed,
  zoneName,
  rooms,
  createdAt,
});

module.exports = { createZone };
