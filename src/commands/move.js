const { sendToActivePlayers } = require('../game/broadcast');
const { red, green } = require('../utils/formatting');

const oppositeDirections = {
  north: 'south',
  south: 'north',
  east: 'west',
  west: 'east',
  up: 'down',
  down: 'up',
};

const createDirectionHandler = (direction) => {
  return (player, args, { roomDb }) => {
    const next = roomDb.findById(player.room.rooms[direction.toUpperCase()]);
    const previous = player.room;

    if (!next) {
      sendToActivePlayers(previous.players, red(`${player.name} bumps into the wall to the ${direction}!!!`));
      return;
    }

    previous.removePlayer(player);
    sendToActivePlayers(previous.players, green(`${player.name} leaves to the ${direction}.`));
    sendToActivePlayers(
      next.players,
      green(`${player.name} enters from the ${oppositeDirections[direction] || 'unknown'}.`),
    );
    player.send(green(`You walk ${direction}.`));

    player.room = next;
    next.addPlayer(player);

    player.send(next.messages.printRoom());
  };
};

module.exports = createDirectionHandler;
