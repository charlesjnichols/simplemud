const { Attribute, PlayerRank } = require('../attributes');
const { matchFull, matchPartial } = require("../utils/matcher")
const { encryptPassword, isEncrypted } = require('../utils/password-vault');

const { createPlayerMessages } = require('./messages');

const PLAYERITEMS = 16;

function createPlayer(data = {}) {
  const get = (key) =>
    Attribute.get(key)?.value ?? (() => { throw new Error(`Unknown attribute key: ${key}`); })();

  const player = {};

  player.name = data.name || 'UNKNOWN';
  player.password = isEncrypted(data.password)
    ? data.password
    : encryptPassword(data.password);
  player.connection = data.connection || null;
  player.id = data.id || null;
  player.rank = typeof data.rank === 'string' ? PlayerRank.get(data.rank) : (data.rank ?? PlayerRank.get('REGULAR'));
  player.class = data.class || null;
  player.loggedIn = false;
  player.active = false;
  player.experience = data.experience || 0;
  player.level = data.level || 1;
  player.room = data.room || 1;
  player.money = data.money || 0;
  player.statPoints = data.statPoints || 0;
  player.weapon = data.weapon ?? -1;
  player.armor = data.armor ?? -1;
  player.hitPoints = data.hitPoints || 0;
  player.nextAttackTime = data.nextAttackTime || 0;
  player.items = 0;
  player.inventory = [];

  player.baseAttributes = Attribute.enums.reduce((acc, attr) => {
    acc[attr.value] = data.attributes?.[attr.key] ?? 0;
    return acc;
  }, {});

  player.attributes = Attribute.enums.reduce((acc, attr) => {
    acc[attr.value] = 0;
    return acc;
  }, {});

  player.GetAttr = (attrKey) => {
    const base = player.baseAttributes[attrKey] || 0;
    const bonus = player.attributes[attrKey] || 0;
    const total = base + bonus;
    const isCore = ['STRENGTH', 'AGILITY', 'HEALTH'].map(k => get(k)).includes(attrKey);
    return isCore ? Math.max(1, total) : total;
  };

  player.recalculateStats = () => {
    const a = player.attributes;
    const level = player.level;

    a[get('MAXHITPOINTS')] = 10 + Math.floor(level * (player.GetAttr(get('HEALTH')) / 1.5));
    a[get('HPREGEN')] = Math.floor(player.GetAttr(get('HEALTH')) / 5) + level;
    a[get('ACCURACY')] = player.GetAttr(get('AGILITY')) * 3;
    a[get('DODGING')] = player.GetAttr(get('AGILITY')) * 3;
    a[get('DAMAGEABSORB')] = Math.floor(player.GetAttr(get('STRENGTH')) / 5);
    a[get('STRIKEDAMAGE')] = Math.floor(player.GetAttr(get('STRENGTH')) / 5);
  };

  player.sendString = (str) => {
    if (!player.connection || typeof player.connection.sendMessage !== 'function') {
      console.error(`Trying to send to ${player.name}, but no valid connection.`);
      return;
    }
    player.connection.sendMessage(str + '\n');
  };

  player.printStatbar = () => {
    const maxHp = player.GetAttr(get('MAXHITPOINTS'));
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
    const matches = player.inventory.findIndex(item => item?.matchFull?.(name));
    if (matches !== -1) return matches;
    return player.inventory.findIndex(item => item?.matchPartial?.(name));
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

  player.setBaseAttr = (attr, val) => {
    player.baseAttributes[attr] = val;
    player.recalculateStats();
  };

  player.addToBaseAttr = (attr, val) => {
    player.baseAttributes[attr] += val;
    player.recalculateStats();
  };

  player.addBonuses = (item) => {
    if (!item) return;
    Attribute.enums.forEach(attr => {
      player.baseAttributes[attr.value] += item.attributes[attr.value] || 0;
    });
    player.recalculateStats();
  };

  player.addDynamicBonuses = (item) => {
    if (!item) return;
    Attribute.enums.forEach(attr => {
      player.attributes[attr.value] += item.attributes[attr.value] || 0;
    });
  };

  player.setHitPoints = (hp) => {
    const max = player.GetAttr(get('MAXHITPOINTS'));
    player.hitPoints = Math.max(0, Math.min(hp, max));
  };

  player.addHitPoints = (hp) => {
    player.setHitPoints(player.hitPoints + hp);
  };

  player.train = () => {
    if (player.needForNextLevel() <= 0) {
      player.statPoints += 2;
      player.baseAttributes[get('MAXHITPOINTS')] += player.level;
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

  player.getWeapon = () =>
    player.weapon === -1 ? 0 : player.inventory[player.weapon];

  player.getArmor = () =>
    player.armor === -1 ? 0 : player.inventory[player.armor];

  player.getMaxItems = () => PLAYERITEMS; // or use a shared constant if preferred

  player.messages = createPlayerMessages(player);

  player.toJSON = () => ({
    id: player.id,
    name: player.name,
    password: player.password,
    rank: player.rank.toString?.() ?? player.rank,
    class: player.class,
    level: player.level,
    experience: player.experience,
    money: player.money,
    statPoints: player.statPoints,
    hitPoints: player.hitPoints,
    nextAttackTime: player.nextAttackTime,
    room: typeof player.room === 'object' ? player.room.id : player.room,
    weapon: player.weapon,
    armor: player.armor,
    attributes: {
      STRENGTH: player.baseAttributes[get('STRENGTH')],
      HEALTH: player.baseAttributes[get('HEALTH')],
      AGILITY: player.baseAttributes[get('AGILITY')],
      MAXHITPOINTS: player.baseAttributes[get('MAXHITPOINTS')],
      ACCURACY: player.baseAttributes[get('ACCURACY')],
      DODGING: player.baseAttributes[get('DODGING')],
      STRIKEDAMAGE: player.baseAttributes[get('STRIKEDAMAGE')],
      DAMAGEABSORB: player.baseAttributes[get('DAMAGEABSORB')],
      HPREGEN: player.baseAttributes[get('HPREGEN')],
    },
    inventory: player.inventory.map(i => i.id),
  });

  player.matchFull = (str) => matchFull(player.name, str);
  player.matchPartial = (str) => matchPartial(player.name, str);

  return player;
}

module.exports = createPlayer;
