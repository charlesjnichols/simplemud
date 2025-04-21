/**
 * @module src/events/store-events.js
 *
 * Handles automatic store refresh behavior and player purchases.
 *
 * @typedef {import('../models/store').Store} Store
 * @typedef {import('../models/item').Item} Item
 * @typedef {import('../models/player').Player} Player
 *
 * @property {number} now - The current timestamp in milliseconds
 *
 * @property {Player} player - The player buying the item.
 * @property {Item} item - The item being purchased.
 */

'use strict';

const _ = require('lodash');
const debug = require('debug')('mud:events:map-events');
const { faker } = require('@faker-js/faker');

const { create_room } = require('../functions/room/create-room');
const { MAP, PLAYER } = require('./event-types');
const { room } = require('../models/player');

/**
 * Registers store-related listeners on the global event bus.
 *
 * Handlers:
 * - `'tick'`: Refreshes store inventory if the refresh interval has passed.
 * - `'store.purchase'`: Deducts player money and adds the item to their inventory.
 *
 * Emits:
 * - `'store.refreshed'`: When a store's inventory is updated.
 *
 * @returns {void}
 */
const register_map_events = () => {
  const { eventBus } = require('./event-bus').get();
  const { roomRepository } = require('../repository/repositories').get();

  const { createZoneMap } = require('../functions/maps/create-map');

  /**
   * Handles the `tick` event to check and refresh stores.
   *
   * @param {import('./event-types').MapGenerateEvent} param0
   */
  eventBus.on(MAP.GENERATE, ({ player, item }) => {
    const zoneId = 'Forgotten Fortress';

    const zone = createZoneMap({
      column: 20,
      row: 20,
      iterationCount: 5,
      seed: '123434',
      zone: 'Forgotten Fortress',
    });

    // const lines = renderZoneMap(zone, { x: 5, y: 8 });
    // lines.forEach((line) => send(player, line));

    const walkable = Object.values(zone).filter((room) => ['room', 'path', 'start', 'boss'].includes(room.type));

    const rooms = walkable.flatMap((room) =>
      create_room({
        id: room.id,
        name: room.name,
        zone: room.zone,
        coords: room.coords,
        rooms: room.exits,
        type: room.type,
        groupId: room.groupId || null,
        isAnchor: room.isAnchor,
        description: room.description || `You are in a ${room.type}.`,
      }),
    );

    rooms.forEach((room) => roomRepository.add(room));
    const startRoom = Object.values(rooms).find((r) => r.type === 'start');

    eventBus.emit(PLAYER.MOVED, {
      player,
      direction: 'portal',
      from: player.room,
      to: `${startRoom.id}`,
      enteredFrom: 'nowhere',
    });
  });
};

module.exports = { register_map_events };
