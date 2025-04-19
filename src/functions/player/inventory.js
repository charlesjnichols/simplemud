/**
 * Inventory-related behaviors for a player.
 *
 * These functions are designed to be attached using a wrapper like `attachBehaviors()`
 * which binds the player instance as the first argument.
 *
 * @module player/inventory
 */

/**
 * Adds an item to the player's inventory.
 *
 * @param {import("../../models/player").Player} player - The player object.
 * @param {import("../../repository/repositories").Item} item - The item to add.
 */
function pickUpItem(player, item) {
  player.inventory.push(item);
}

/**
 * Removes an item from the player's inventory.
 * If the item was equipped as a weapon or armor, it is unequipped first.
 *
 * @param {import("../../models/player").Player} player - The player object.
 * @param {import("../../repository/repositories").Item} item -
 * @returns {boolean} True if the item was dropped successfully, false otherwise.
 */
function dropItem(player, item) {
  if (player.weapon?.id === item.id) {
    removeWeapon(player);
  } else if (player.armor?.id === item.id) {
    removeArmor(player);
  } else {
    const index = player.inventory.findIndex((i) => i.id === item.id);
    if (index > -1) {
      player.inventory.splice(index, 1);
    }
  }
  return true;
}

/**
 * Equips an item from inventory as a weapon.
 *
 * @param {import("../../models/player").Player} player - The player object.
 * @param {import("../../repository/repositories").Item} item - Inventory index of the weapon to equip.
 */
function useWeapon(player, item) {
  removeWeapon(player);
  dropItem(player, item);
  player.weapon = item;
}

/**
 * Unequips the currently equipped weapon.
 *
 * @param {import("../../models/player").Player} player - The player object.
 */
function removeWeapon(player) {
  if (player.weapon) {
    pickUpItem(player, player.weapon);
    player.weapon = null;
  }
}

/**
 * Equips an item from inventory as armor.
 *
 * @param {import("../../models/player").Player} player - The player object.
 * @param {import("../../repository/repositories").Item} item - Inventory index of the armor to equip.
 */
function useArmor(player, item) {
  removeArmor(player);
  dropItem(player, item);
  player.armor = item;
}

/**
 * Unequips the currently equipped armor.
 *
 * @param {import("../../models/player").Player} player - The player object.
 */
function removeArmor(player) {
  if (player.armor) {
    pickUpItem(player, player.armor);
    player.armor = null;
  }
}

module.exports = {
  pickUpItem,
  dropItem,
  useWeapon,
  removeWeapon,
  useArmor,
  removeArmor,
};
