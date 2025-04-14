const { Attribute } = require('../attributes');
const { sendRoom } = require('../game/broadcast');
const { redBold, whiteBold, cyanBold, cyan } = require('../utils/formatting');
const { randomInt } = require('../utils/math');

const debug = require('debug')('mud:combat:death');

const handleDeath = (attacker, target, { enemyDb, roomDb, itemDb }) => {
  if (target.isPlayer) {
    debug(`${target.name} (player) has died.`);

    target.send(redBold(`You were killed by an ${attacker.name}!`));

    target.room.removePlayer(target);
    target.room = roomDb.findById(1);
    target.room.addPlayer(target);

    target.setHitPoints(Math.floor(target.maxHp * 0.7));

    target.send(target.room, whiteBold(`You have died, but have been ressurected in ${target.room.name}`));
    sendRoom(target.room, whiteBold(`${target.name} appears out of nowhere!!`));
  } else {
    debug(`${target.name} (enemy) has died.`);

    sendRoom(target.room, cyanBold(`${target.name} has died!`));

    // drop all the items
    target.tp.loot.forEach((loot) => {
      if (randomInt(0, 99) < loot.chance) {
        const item = itemDb.findById(loot.itemId);
        target.room.addItem(item);
        sendRoom(target.room, cyan(`${item.name} drops to the ground.`));
      }
    });

    attacker.experience += target.tp.experience;
    attacker.send(cyanBold(`You gain ${target.tp.experience} experience.`));
    enemyDb.delete(target);
  }
};

module.exports = { handleDeath };
