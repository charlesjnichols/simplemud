const { register_player_events } = require('../events/player-events');
const { register_room_events } = require('../events/room-events');
const { register_store_events } = require('../events/store-events');
const { register_inventory_events } = require('../events/inventory-events');
const { register_enemy_events } = require('../events/enemy-events');
const { register_combat_events } = require('../events/combat-events');

module.exports = () => {
  register_player_events();
  register_room_events();
  register_store_events();
  register_inventory_events();
  register_enemy_events();
  register_combat_events();
};
