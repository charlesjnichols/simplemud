const _ = require('lodash');
const Fuse = require('fuse.js');

const { redBold, cyanBold } = require('../../utils/formatting');
const { sendRoom } = require('../../game/broadcast');

module.exports = (player, args) => {
  if (!player.inventory) {
    player.send(redBold("You don't have that!"));
  }

  const fuse = new Fuse(player.inventory, {
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
  const itemIndex = player.getItemIndex(item.name);

  sendRoom(player.room, cyanBold(`${player.name} drops ${item.name}.`));

  player.room.addItem(item);
  player.dropItem(itemIndex);
};
