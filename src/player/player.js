const { PlayerRank, RoomType } = require('../enums');
const { encryptPassword, isEncrypted } = require('../utils/password-vault');
const { createController } = require('./controller');

const PLAYERITEMS = 16;
const STATBAR_INTERVAL_MS = 5000; // 10 seconds

function createPlayer(data = {}, { roomDb = null, playerDb = null } = {}) {
  const player = {};
  player.isPlayer = () => true;
  player.id = data.id || null;
  player.name = data.name || 'UNKNOWN';
  player.password = isEncrypted(data.password) ? data.password : encryptPassword(data.password);
  player.connection = data.connection || null;
  player.rank = typeof data.rank === 'string' ? data.rank : (data.rank ?? PlayerRank.REGULAR);
  player.loggedIn = false;
  player.active = false;
  player.experience = data.experience || 0;
  player.level = data.level || 1;
  player.room = data.room || 1;
  player.weapon = data.weapon ?? -1;
  player.armor = data.armor ?? -1;
  player.hitPoints = data.hitPoints || 100;
  player.lastSentHp = 0;
  player.lastStatbarTime = 0;
  player.maxHp = data.maxHp || 100;
  player.nextAttackTime = data.nextAttackTime || 0;
  player.inventory = [];
  player.attributes = {
    STRENGTH: 1,
    DEXTERITY: 1,
    INTELLIGENCE: 1,
  };

  if (roomDb) {
    player.room = roomDb.findById(player.room);
  }

  player.sendString = (str) => {
    if (!player.connection || typeof player.connection.sendMessage !== 'function') {
      console.error(`Trying to send to ${player.name}, but no valid connection.`);
      return;
    }
    player.connection.sendMessage(str + '\n');
  };

  player.printStatbar = () => {
    const maxHp = player.maxHp;
    player.sendString(`[HP: ${player.hitPoints}/${maxHp}]`);
  };

  player.sendPrompt = () => player.sendString('> ');

  player.pickUpItem = (item) => {
    if (player.items < 16) {
      player.inventory[player.items++] = item;
      return true;
    }
    return false;
  };

  player.dropItem = (index) => {
    if (player.inventory[index]) {
      if (player.weapon === index) player.removeWeapon();
      if (player.armor === index) player.removeArmor();
      player.inventory.splice(index, 1);
      player.items--;
      return true;
    }
    return false;
  };

  player.getItemIndex = (name) => {
    const matches = player.inventory.findIndex((item) => item?.matchFull?.(name));
    if (matches !== -1) return matches;
    return player.inventory.findIndex((item) => item?.matchPartial?.(name));
  };

  player.useWeapon = (index) => {
    player.removeWeapon();
    player.weapon = index;
    player.recalculateStats();
  };

  player.removeWeapon = () => {
    player.weapon = -1;
    player.recalculateStats();
  };

  player.useArmor = (index) => {
    player.removeArmor();
    player.armor = index;
    player.recalculateStats();
  };

  player.removeArmor = () => {
    player.armor = -1;
    player.recalculateStats();
  };

  player.setHitPoints = (hp) => {
    player.hitPoints = Math.max(0, Math.min(hp, player.maxHp));
  };

  player.addHitPoints = (hp) => {
    player.setHitPoints(player.hitPoints + hp);
  };

  player.isAlive = () => player.hitPoints > 0;

  player.train = () => {
    if (player.needForNextLevel() <= 0) {
      player.statPoints += 2;
      player.maxHp += player.level;
      player.level++;
      player.recalculateStats();
      return true;
    }
    return false;
  };

  player.needForLevel = (level) => {
    return Math.round(100 * (Math.pow(1.4, level - 1) - 1));
  };

  player.needForNextLevel = () => {
    return player.needForLevel(player.level + 1) - player.experience;
  };

  player.getWeapon = () => (player.weapon === -1 ? 0 : player.inventory[player.weapon]);

  player.getArmor = () => (player.armor === -1 ? 0 : player.inventory[player.armor]);

  player.getMaxItems = () => PLAYERITEMS; // or use a shared constant if preferred

  player.isInStore = () => player.room.type === RoomType.STORE;

  player.send = (message) => {
    const now = Date.now();

    if (!player.connection || player.connection === 0) {
      console.error(`Trying to send string to player ${player.name} but player is not connected.`);
      return;
    }

    player.connection.sendMessage(message + '\n');

    if (player.active && typeof player.printStatbar) {
      const hpChanged = player.lastHP == null || player.hitPoints !== player.lastHP;
      const timeElapsed = player.lastStatbarTime == null || now - player.lastStatbarTime >= STATBAR_INTERVAL_MS;

      if (hpChanged || timeElapsed) {
        player.lastHP = player.hitPoints;
        player.lastStatbarTime = now;
        player.printStatbar();
      }
    }
  };

  player.controller = createController(player, { roomDb, playerDb });

  player.toJSON = () => ({
    id: player.id,
    name: player.name,
    password: player.password,
    rank: player.rank.toString?.() ?? player.rank,
    level: player.level,
    experience: player.experience,
    hitPoints: player.hitPoints,
    maxHp: player.maxHp,
    nextAttackTime: player.nextAttackTime,
    room: typeof player.room === 'object' ? player.room.id : player.room,
    weapon: player.weapon,
    armor: player.armor,
    attributes: player.attributes,
    inventory: player.inventory.map((i) => i.id),
  });

  return player;
}

module.exports = createPlayer;
