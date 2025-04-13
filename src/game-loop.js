'use strict';

const jsonfile = require('jsonfile');
const path = require('path');

const { Attribute } = require('./attributes');
const { seconds, minutes } = require('./utils/time');
const { createTimer } = require('./utils/time');
const { sendRoom } = require('./game/broadcast');
const { redBold } = require('./utils/formatting');

const timer = createTimer();

const DBSAVETIME = minutes(15);
const ROUNDTIME = seconds(1);
const REGENTIME = minutes(2);
const HEALTIME = minutes(1);

const file = path.join(__dirname, '..', 'data', 'gamedata.json');

class GameLoop {
  constructor({ enemyDb, enemyTpDb, roomDb, playerDb, saveDatabases }) {
    this.saveDatabases = saveDatabases;
    this.enemyDb = enemyDb;
    this.enemyTpDb = enemyTpDb;
    this.roomDb = roomDb;
    this.playerDb = playerDb;
  }

  load() {
    const isEmpty = (obj) => {
      return Object.keys(obj).length === 0 && obj.constructor === Object;
    };
    const dataObject = jsonfile.readFileSync(file);
    if (!isEmpty(dataObject)) {
      const gameTime = parseInt(dataObject['GAMETIME']);
      timer.reset(gameTime);
      this.saveDbTime = parseInt(dataObject['SAVEDATABASES']);
      this.nextRound = parseInt(dataObject['NEXTROUND']);
      this.nextRegen = parseInt(dataObject['NEXTREGEN']);
      this.nextHeal = parseInt(dataObject['NEXTHEAL']);
    } else {
      timer.reset();
      this.saveDbTime = DBSAVETIME;
      this.nextRound = ROUNDTIME;
      this.nextRegen = REGENTIME;
      this.nextHeal = HEALTIME;
    }
  }

  save() {
    const dataObject = {
      GAMETIME: timer.getMS(),
      SAVEDATABASES: this.saveDbTime,
      NEXTROUND: this.nextRound,
      NEXTREGEN: this.nextRegen,
      NEXTHEAL: this.nextHeal,
    };
    jsonfile.writeFileSync(file, dataObject, { spaces: 2 });
  }

  saveDatabases() {
    this.save();
    this.saveDatabases();
  }

  loop() {
    if (timer.getMS() >= this.nextRound) {
      this.performRound();
      this.nextRound += ROUNDTIME;
    }
    if (timer.getMS() >= this.nextRegen) {
      this.performRegen();
      this.nextRegen += REGENTIME;
    }
    if (timer.getMS() >= this.nextHeal) {
      this.performHeal();
      this.nextHeal += HEALTIME;
    }
    if (timer.getMS() >= this.saveDbTime) {
      this.saveDatabases();
      this.saveDbTime += DBSAVETIME;
    }
  }

  performRound() {
    const now = timer.getMS();
    for (const enemy of this.enemyDb.values()) {
      if (now >= enemy.nextAttackTime && enemy.room.players.length > 0) {
        Game.enemyAttack(enemy);
      }
    }
  }

  performRegen() {
    for (const room of this.roomDb.values()) {
      if (room.spawnWhich !== 0 && room.enemies.length < room.maxEnemies) {
        const template = this.enemyTpDb.findById(room.spawnWhich);
        const enemy = this.enemyDb.create(template, room);
        sendRoom(room, `${redBold(enemy.name)} enters the room!`);
      }
    }
  }

  performHeal() {
    for (const p of this.playerDb.values()) {
      if (p.active) {
        p.addHitPoints(p.GetAttr(Attribute.get('HPREGEN')));
        p.printStatbar();
      }
    }
  }
}

module.exports = GameLoop;
