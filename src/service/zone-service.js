const { create_zone_map } = require('../functions/zone');
const { create_room } = require('../functions/room/create-room');
const { create_zone } = require('../functions/zone/create-zone');

/**
 * Creates and registers a zone, sends the player to the start.
 *
 * @param {string} zoneId
 * @param {string} seed
 * @param {string} zoneName
 */
const generate_zone_instance = (zoneId, seed, zoneName) => {
  const { roomRepository, zoneRepository } = require('../repository/repositories').get();

  const zoneMap = create_zone_map({
    column: 40,
    row: 10,
    seed,
    zone: zoneName,
  });

  const walkable = Object.values(zoneMap).filter((room) => ['room', 'path', 'start', 'boss'].includes(room.type));

  const zone = create_zone({
    id: zoneId,
    rooms: zoneMap,
    seed,
    zoneName,
    createdAt: Date.now(),
  });

  // Register the rooms
  walkable
    .map((room) =>
      create_room({
        id: room.id,
        name: room.name,
        zone: zone.id,
        rooms: room.exits,
        type: room.type,
        description: room.description || `You are in a ${room.type}.`,
      }),
    )
    .forEach(roomRepository.add);

  // Register the zone
  zoneRepository.add(zone);
  return zone;
};

/**
 * Removes a zone and its metadata.
 * @param {string} zoneId
 */
const destroy_zone_instance = (zoneId) => {
  const { zoneRepository } = require('../repository/repositories').get();

  zoneRepository.delete(zoneId);
  // Optionally also remove rooms from roomRepository
};

/**
 * gets a zone
 * @param {string} zoneId
 */
const get_zone = (zoneId) => {
  const { zoneRepository } = require('../repository/repositories').get();
  return zoneRepository.get(zoneId);
};

module.exports = {
  generate_zone_instance,
  destroy_zone_instance,
  get_zone,
};
