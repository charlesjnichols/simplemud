const { printSection, printTwoCol } = require('../../utils/formatting');

module.exports = (player) => {
  const items = player.inventory.map((item) => item.name).join(', ') || 'None';
  const weapon = player.getWeapon() ? player.getWeapon().name : 'NONE!';
  const armor = player.getArmor() ? player.getArmor().name : 'NONE!';
  const money = `$${player.money}`;

  const lines = [
    printTwoCol('Items:', items),
    printTwoCol('Weapon:', weapon),
    printTwoCol('Armor:', armor),
    printTwoCol('Money:', money),
  ];

  player.send(printSection('Your Inventory', lines));
};
