const { sendRoom } = require('../../game/broadcast');
const { redBold, cyanBold } = require('../../utils/formatting');
const Fuse = require('fuse.js');

const _ = require('lodash');

module.exports = (player, [itemName]) => {
  if (!itemName) {
    player.sendString(redBold('What do you want to buy.'));
    return;
  }

  const store = player.room.store;
  if (!store) {
    player.sendString(redBold("There's no store here."));
    return;
  }

  const fuse = new Fuse(store.items, {
    keys: ['name'],
    threshold: 0.4,
  });

  const matches = fuse.search(itemName);
  if (matches.length === 0) {
    player.sendString(redBold("Sorry, we don't have that item!"));
    return;
  }

  if (matches.length > 1) {
    const options = matches.map((m, i) => `  ${i + 1}. ${m.item.name}`).join('\n');
    player.sendString(redBold('Multiple matches found:\n') + options + '\nPlease be more specific.');
    return;
  }

  const item = _.first(matches).item;

  if (!item) {
    player.sendString(redBold("Sorry, we don't have that item!"));
    return;
  }

  if (player.money < item.price) {
    player.sendString(redBold("Sorry, but you can't afford that!"));
    return;
  }

  if (!player.pickUpItem(item)) {
    player.sendString(redBold("Sorry, but you can't carry that much!"));
    return;
  }

  player.money -= item.price;
  sendRoom(player.room, cyanBold(`${player.name} buys a ${item.name}`));
};
