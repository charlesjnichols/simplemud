const { logoutMessage, sendToActivePlayers } = require('../game/broadcast');
const { yellowBold } = require('../utils/formatting');
const Train = require('../train');

const createController = (player, { roomDb, playerDb }) => {
  const leaveToTrain = () => {
    logoutMessage(`${player.name} leaves to edit stats`);
    player.connection.addHandler(new Train(player.connection, player));
  };

  const enter = () => {
    player.active = true;
    player.loggedIn = true;
    player.nextAttackTime = 0;

    // Hydrate room ID to room object
    if (!isNaN(player.room)) {
      player.room = roomDb.findById(player.room);
    }

    player.room.addPlayer(player);
    sendToActivePlayers(playerDb.values(), yellowBold(`${player.name} has entered the realm.`));

    if (player.newbie) {
      leaveToTrain();
    } else {
      player.sendString(player.room.messages.printRoom());
    }
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
