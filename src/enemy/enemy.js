'use strict';

const { matchFull, matchPartial } = require('../utils/matcher');

function createEnemyTemplate(data = {}) {
  const template = {
    id: data.ID ?? null,
    name: data.NAME || 'Unknown',
    hitPoints: Number(data.HITPOINTS) || 0,
    accuracy: Number(data.ACCURACY) || 0,
    dodging: Number(data.DODGING) || 0,
    strikeDamage: Number(data.STRIKEDAMAGE) || 0,
    damageAbsorb: Number(data.DAMAGEABSORB) || 0,
    experience: Number(data.EXPERIENCE) || 0,
    weapon: Number(data.WEAPON) || 0,
    moneyMin: Number(data.MONEYMIN) || 0,
    moneyMax: Number(data.MONEYMAX) || 0,
    loot: Array.isArray(data.LOOT) ? data.LOOT : [],
    matchFull: (str) => matchFull(data.NAME || '', str),
    matchPartial: (str) => matchPartial(data.NAME || '', str),
  };

  return template;
}

function createEnemy(data = {}, enemyTpDb, roomDb) {
  const templateId = Number(data.TEMPLATEID);
  const roomId = Number(data.ROOM);
  const tp = enemyTpDb.findById(templateId);
  const room = roomDb.findById(roomId);

  const enemy = {
    id: data.ID ?? null,
    name: tp?.name || 'Unnamed Enemy',
    hitPoints: Number(data.HITPOINTS) || tp?.hitPoints || 0,
    tp,
    room,
    nextAttackTime: Number(data.NEXTATTACKTIME) || 0,
    matchFull: (str) => matchFull(tp?.name || '', str),
    matchPartial: (str) => matchPartial(tp?.name || '', str),

    loadTemplate: (template) => {
      if (!template) throw new Error('Enemy template is undefined or null');
      enemy.tp = template;
      enemy.name = template.name;
      enemy.hitPoints = template.hitPoints;
    },

    loadData: (dataObject) => {
      const templateId = Number(dataObject.TEMPLATEID);
      const roomId = Number(dataObject.ROOM);
      enemy.tp = enemyTpDb.findById(templateId);
      enemy.name = enemy.tp?.name || 'Unnamed Enemy';
      enemy.hitPoints = Number(dataObject.HITPOINTS) || 0;
      enemy.room = roomDb.findById(roomId);
      enemy.nextAttackTime = Number(dataObject.NEXTATTACKTIME) || 0;
    },

    serialize: () => ({
      ID: enemy.id,
      TEMPLATEID: enemy.tp?.id ?? -1,
      HITPOINTS: enemy.hitPoints,
      ROOM: enemy.room?.id ?? -1,
      NEXTATTACKTIME: enemy.nextAttackTime,
    }),
  };

  return enemy;
}

module.exports = {
  createEnemyTemplate,
  createEnemy,
};
