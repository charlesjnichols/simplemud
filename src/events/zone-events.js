/**
 * @module src/events/store-events.js
 *
 * Handles automatic store refresh behavior and player purchases.
 *
 */

'use strict';

// const debug = require('debug')('mud:events:map-events');
const error = require('debug')('mud:events:map-events:error');

const { send } = require('../functions/player');
const { render_room } = require('../functions/room');
const { ZONE, PLAYER } = require('./event-types');

const register_zone_events = () => {
  const { eventBus } = require('./event-bus').get();
  const { generate_zone_instance } = require('../service/zone-service');

  /**
   * Handles the `tick` event to check and refresh stores.
   *
   * @param {import('./event-types').ZoneGenerateEvent} param0
   */
  eventBus.on(ZONE.GENERATE, ({ player, item }) => {
    const zone = generate_zone_instance(item.id, 'Forgotten Fortress', 'Forgotten Fortress');
    const startRoom = Object.values(zone.rooms).find((r) => r.type === 'start');

    if (!startRoom) {
      error('zone has no start room %O', zone);
      return;
    }

    eventBus.emit(PLAYER.MOVED, {
      player,
      direction: 'portal',
      from: player.room,
      to: `${startRoom.id}`,
      enteredFrom: 'nowhere',
    });
  });

  /**
   * Handles the `tick` event to check and refresh stores.
   *
   * @param {import('./event-types').PortalOpenedEvent} param0
   */
  eventBus.on(ZONE.PORTAL_OPENED, ({ player, room }) => {
    room.portal = '1';
    send(player, 'a mysterous portal appears out of nowhere');
    send(player, render_room(player));
  });
};

module.exports = { register_zone_events };
