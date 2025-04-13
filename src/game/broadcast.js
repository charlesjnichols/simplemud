const { cyanBold, redBold } = require('../utils/formatting');

const sendToActivePlayers = (players, message) => {
  players.filter((p) => p['active']).forEach((p) => p.send(message));
};

const sendToLoggedInPlayers = (players, message) => {
  players.filter((p) => p['loggedIn']).forEach((p) => p.send(message));
};

const logoutMessage = (players, reason) => {
  sendToLoggedInPlayers(players, redBold(reason));
};

const announce = (players, announcement) => {
  sendToLoggedInPlayers(players, cyanBold(announcement));
};

const sendRoom = (room, message) => {
  room.players.forEach((player) => {
    player.send(message);
  });
};

module.exports = {
  sendToActivePlayers,
  sendToLoggedInPlayers,
  sendRoom,
  logoutMessage,
  announce,
};
