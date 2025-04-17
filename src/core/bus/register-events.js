const { register_player_events } = require('./event/player-events');
const { register_room_events } = require('./event/room-events');
const { register_store_events } = require('./event/store-events');
const { register_inventory_events } = require('./event/inventory-events');
const { register_enemy_events } = require('./event/enemy-events');
const { register_combat_events } = require('./event/combat-events');

module.exports = {
  register_events: () => {
    register_player_events();
    register_room_events();
    register_store_events();
    register_inventory_events();
    register_enemy_events();
    register_combat_events();
  },
};
