const { send } = require('../../functions/player');
const { printSection, printTwoCol } = require('../../utils/formatting');

module.exports = (player) => {
  const items = player.inventory.map((item) => item.name).join(', ') || 'None';
  const weapon = player.weapon ? player.weapon.name : 'Sweaty Palms!';
  const armor = player.armor ? player.armor.name : 'Naked!';
  const money = `$${player.money}`;

  const lines = ['Items: ' + items, printTwoCol('Weapon: ' + weapon, 'Armor: ' + armor), 'Money: ' + money];

  send(player, printSection('Your Inventory', lines));
};
