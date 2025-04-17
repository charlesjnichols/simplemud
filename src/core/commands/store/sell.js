const _ = require('lodash');
const Fuse = require('fuse.js');

const { send } = require('../../functions/player');
const { redBold, cyanBold } = require('../../../utils/formatting');
const { send_to_room } = require('../../functions/world');
const { roomRepository } = require('../../datastores').get();

module.exports = (player, [itemName]) => {
  if (!itemName) {
    send(player, redBold('What do you want to sell.'));
    return;
  }

  const room = roomRepository.get(player.room);
  const storeId = room.store;
  if (!storeId) {
    send(player, redBold("There's no store here."));
    return;
  }

  // @ts-ignore
  const fuse = new Fuse(player.inventory, {
    keys: ['name'],
    threshold: 0.4,
  });

  const matches = fuse.search(itemName);
  if (matches.length === 0) {
    send(player, redBold("Sorry, you don't have that item!"));
    return;
  }

  if (matches.length > 1) {
    const options = matches.map((m, i) => `  ${i + 1}. ${m.item.name}`).join('\n');
    send(player, redBold('Multiple matches found:\n') + options + '\nPlease be more specific.');
    return;
  }

  const item = _.first(matches).item;
  const index = player.inventory.findIndex((i) => i === item);

  player.dropItem(index);
  player.money += item.price;
  send_to_room(player.room, cyanBold(`${player.name} sells ${item.name}`));
};
