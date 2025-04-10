'use strict';

// This file contains the definition of
// both EnemyTemplate and Enemy classes

const Entity = require('./entity');

class EnemyTemplate extends Entity {
  constructor() {
    super();
    this.hitPoints = 0;
    this.accuracy = 0;
    this.dodging = 0;
    this.strikeDamage = 0;
    this.damageAbsorb = 0;
    this.experience = 0;
    this.weapon = 0;
    this.moneyMin = 0;
    this.moneyMax = 0;
    this.loot = [];
  }

  load(dataObject = {}) {
    this.name = dataObject["NAME"] || 'Unknown';
    this.hitPoints = Number(dataObject["HITPOINTS"]) || 0;
    this.accuracy = Number(dataObject["ACCURACY"]) || 0;
    this.dodging = Number(dataObject["DODGING"]) || 0;
    this.strikeDamage = Number(dataObject["STRIKEDAMAGE"]) || 0;
    this.damageAbsorb = Number(dataObject["DAMAGEABSORB"]) || 0;
    this.experience = Number(dataObject["EXPERIENCE"]) || 0;
    this.weapon = Number(dataObject["WEAPON"]) || 0;
    this.moneyMin = Number(dataObject["MONEYMIN"]) || 0;
    this.moneyMax = Number(dataObject["MONEYMAX"]) || 0;
    this.loot = Array.isArray(dataObject["LOOT"]) ? dataObject["LOOT"] : [];
  }
}

class Enemy extends Entity {
  constructor() {
    super();
    this.tp = null; // Template instance
    this.hitPoints = 0;
    this.room = null;
    this.nextAttackTime = 0;
  }

  loadTemplate(template) {
    if (!template) {
      throw new Error("Enemy template is undefined or null");
    }
    this.tp = template;
    this.name = template.name;
    this.hitPoints = template.hitPoints;
  }

  loadData(dataObject = {}, enemyTpDb, roomDb) {
    const templateId = Number(dataObject["TEMPLATEID"]);
    const roomId = Number(dataObject["ROOM"]);

    this.tp = enemyTpDb.findById(templateId);
    this.name = this.tp?.name || 'Unnamed Enemy';
    this.hitPoints = Number(dataObject["HITPOINTS"]) || 0;
    this.room = roomDb.findById(roomId);
    this.nextAttackTime = Number(dataObject["NEXTATTACKTIME"]) || 0;
  }

  serialize() {
    return {
      "ID": this.id,
      "TEMPLATEID": this.tp?.id ?? this.tp ?? -1,
      "HITPOINTS": this.hitPoints,
      "ROOM": this.room?.id ?? this.room ?? -1,
      "NEXTATTACKTIME": this.nextAttackTime
    };
  }
}

module.exports = { EnemyTemplate, Enemy };
