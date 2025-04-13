const { yellowBold } = require('../../utils/formatting');
const { sendToLoggedInPlayers } = require('../../game/broadcast');

module.exports = (player, args, { playerDb }) => {
  player.room.removePlayer(player);
  player.connection.close();
  sendToLoggedInPlayers(playerDb.values(), yellowBold(`${player.name} has left the realm.`));
};
