const _ = require('lodash');
const Fuse = require('fuse.js');

const { redBold, cyanBold } = require('../../utils/formatting');
const { send_to_room } = require('../../functions/world');
const { send } = require('../../functions/player');

module.exports = (player, args) => {
  if (!player.room.items) {
    send(player, redBold("There's nothing here to pickup!"));
  }

  // @ts-ignore
  const fuse = new Fuse(player.room.items, {
    keys: ['name'],
    threshold: 0.4,
  });

  const matches = fuse.search(args.join(' '));
  if (matches.length === 0) {
    send(player, redBold("You don't see that here!!"));
    return;
  }

  if (matches.length > 1) {
    const options = matches.map((m, i) => `  ${i + 1}. ${m.item.name}`).join('\n');
    send(player, redBold('Multiple matches found:\n') + options + '\nPlease be more specific.');
    return;
  }

  const item = _.first(matches).item;

  if (!player.pickUpItem(item)) {
    send(player, redBold("You can't carry that much!"));
    return;
  }

  player.room.removeItem(item);
  send_to_room(player, cyanBold(`${player.name} picks up ${item.name}.`));
};
