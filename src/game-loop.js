'use strict';

const jsonfile = require('jsonfile');
const path = require('path');

const { Attribute } = require('./attributes');

const {seconds, minutes} = require('./utils/time');
const DB = require('./databases');
const Game = require('./game');

const timer = Game.getTimer();

const DBSAVETIME = minutes( 15 );
const ROUNDTIME  = seconds( 1 );
const REGENTIME  = minutes( 2 );
const HEALTIME   = minutes( 1 );

const file = path.join(__dirname, '..', 'data', 'gamedata.json');

class GameLoop {
  constructor() {
    this.db = DB;
  }

  load() {
    const isEmpty = (obj) => {
      return Object.keys(obj).length === 0 && obj.constructor === Object;
    };
    const dataObject = jsonfile.readFileSync(file);
    if (!isEmpty(dataObject)) {
      const gameTime = parseInt(dataObject["GAMETIME"]);
      timer.reset(gameTime);
      this.saveDbTime = parseInt(dataObject["SAVEDATABASES"]);
      this.nextRound = parseInt(dataObject["NEXTROUND"]);
      this.nextRegen = parseInt(dataObject["NEXTREGEN"]);
      this.nextHeal = parseInt(dataObject["NEXTHEAL"]);
    } else {
      timer.reset();
      this.saveDbTime = DBSAVETIME;
      this.nextRound = ROUNDTIME;
      this.nextRegen = REGENTIME;
      this.nextHeal = HEALTIME;
    }
    Game.setIsRunning(true);
  }

  save() {
    const dataObject = {
      "GAMETIME": Game.getTimer().getMS(),
      "SAVEDATABASES": this.saveDbTime,
      "NEXTROUND": this.nextRound,
      "NEXTREGEN": this.nextRegen,
      "NEXTHEAL": this.nextHeal
    }
    jsonfile.writeFileSync(file, dataObject, {spaces: 2});
  }

  loadDatabases() {
    this.load();
    DB.loadDatabases();
  }

  saveDatabases() {
    this.save();
    DB.saveDatabases();
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
    for(const enemy of DB.enemyDb.values()) {
      if (now >= enemy.nextAttackTime &&
          enemy.room.players.length > 0) {
        Game.enemyAttack(enemy);
      }
    }
  }

  performRegen() {
    for (const room of DB.roomDb.values()) {
      if (room.spawnWhich !== 0 &&
          room.enemies.length < room.maxEnemies) {
        const template = DB.enemyTpDb.findById(room.spawnWhich);
        const enemy = DB.enemyDb.create(template, room);
        Game.sendRoom("<red><bold>" + enemy.name +
                      " enters the room!</bold></red>", room);
      }
    }
  }

  performHeal() {
    for (const p of DB.playerDb.values()) {
      if (p.active) {
        p.addHitPoints(p.GetAttr(Attribute.HPREGEN));
        p.printStatbar();
      }
    }
  }

}

module.exports = GameLoop;
