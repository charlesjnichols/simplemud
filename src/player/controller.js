const { sendToActivePlayers } = require('../game/broadcast');
const { yellowBold } = require('../utils/formatting');

const createController = (player, { roomDb, playerDb }) => {
  const enter = () => {
    player.active = true;
    player.loggedIn = true;
    player.nextAttackTime = 0;

    // Hydrate room ID to room object
    if (!isNaN(player.room)) {
      player.room = roomDb.findById(player.room);
    }

    sendToActivePlayers(playerDb.values(), yellowBold(`${player.name} has entered the realm.`));

    player.room.addPlayer(player);
    player.sendString(player.room.messages.printRoom());
  };

  const leave = () => {
    player.active = false;

    if (player.connection.isClosed) {
      playerDb.logout(player.id);

      // Only remove from room if it's hydrated
      if (typeof player.room !== 'number' && player.room?.removePlayer) {
        player.room.removePlayer(player);
      }
    }
  };

  return {
    enter,
    leave,
  };
};

module.exports = {
  createController,
};
