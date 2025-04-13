const _ = require('lodash');
const Fuse = require('fuse.js');

const { redBold, cyanBold } = require('../../utils/formatting');
const { sendRoom } = require('../../game/broadcast');

module.exports = (player, args) => {
  if (!player.room.items) {
    player.send(redBold("There's nothing here to pickup!"));
  }

  const fuse = new Fuse(player.room.items, {
    keys: ['name'],
    threshold: 0.4,
  });

  const matches = fuse.search(args.join(' '));
  if (matches.length === 0) {
    player.sendString(redBold("You don't see that here!!"));
    return;
  }

  if (matches.length > 1) {
    const options = matches.map((m, i) => `  ${i + 1}. ${m.item.name}`).join('\n');
    player.sendString(redBold('Multiple matches found:\n') + options + '\nPlease be more specific.');
    return;
  }

  const item = _.first(matches).item;

  if (!player.pickUpItem(item)) {
    player.sendString(redBold("You can't carry that much!"));
    return;
  }

  player.room.removeItem(item);
  sendRoom(player.room, cyanBold(`${player.name} picks up ${item.name}.`));
};
