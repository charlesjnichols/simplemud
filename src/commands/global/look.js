const { send } = require('../../functions/player');
const { render_room } = require('../../functions/room');

module.exports = (player) => {
  send(player, render_room(player.room));
};
