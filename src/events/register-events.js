const { register_player_events } = require('./player-events');
const { register_room_events } = require('./room-events');
const { register_store_events } = require('./store-events');
const { register_inventory_events } = require('./inventory-events');
const { register_enemy_events } = require('./enemy-events');
const { register_combat_events } = require('./combat-events');

module.exports = () => {
  register_player_events();
  register_room_events();
  register_store_events();
  register_inventory_events();
  register_enemy_events();
  register_combat_events();
};
