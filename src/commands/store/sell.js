const { sendRoom } = require('../../game/broadcast');
const { redBold, cyanBold } = require('../../utils/formatting');
const Fuse = require('fuse.js');

const _ = require('lodash');

module.exports = (player, [itemName]) => {
  if (!itemName) {
    player.sendString(redBold('What do you want to sell.'));
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
    player.sendString(redBold("Sorry, you don't have that item!"));
    return;
  }

  if (matches.length > 1) {
    const options = matches.map((m, i) => `  ${i + 1}. ${m.item.name}`).join('\n');
    player.sendString(redBold('Multiple matches found:\n') + options + '\nPlease be more specific.');
    return;
  }

  const item = _.first(matches).item;
  const index = player.inventory.findIndex((i) => i === item);
  if (index === -1) {
    player.sendString(redBold("Sorry, you don't have that item!"));
    return;
  }

  player.dropItem(index);
  player.money += item.price;
  sendRoom(player.room, cyanBold(`${player.name} sells ${item.name}`));
};
