'use strict';

const debug = require('debug')('mud:game:gameloop');

const jsonfile = require('jsonfile');
const path = require('path');
const { Temporal } = require('@js-temporal/polyfill');

const { sendRoom } = require('./broadcast');
const { redBold } = require('../utils/formatting');
const { performAutoAttack } = require('../combat/auto-attack');

// Millisecond-based constants
const DBSAVETIME = 15 * 60 * 1000; // 15 minutes
const ROUNDTIME = 1000; // 1 second
const REGENTIME = 10 * 1000; // 1 minutes

const file = path.join(__dirname, '..', 'data', 'gamedata.json');

// Pure functional time tracker
const createTimeTracker = (savedMs = 0) => {
  const started = Temporal.Now.instant().subtract({ milliseconds: savedMs });
  return () => Temporal.Now.instant().since(started).total('milliseconds');
};

class GameLoop {
  constructor(databases) {
    this.databases = databases;
    this.getElapsedMs = createTimeTracker();
    this.saveDbTime = DBSAVETIME;
    this.nextRound = ROUNDTIME;
    this.nextRegen = REGENTIME;
  }

  load() {
    const isEmpty = (obj) => {
      return Object.keys(obj).length === 0 && obj.constructor === Object;
    };
    const dataObject = jsonfile.readFileSync(file);
    if (!isEmpty(dataObject)) {
      const gameTime = parseInt(dataObject['GAMETIME']);
      this.getElapsedMs = createTimeTracker(gameTime);
      this.saveDbTime = parseInt(dataObject['SAVEDATABASES']);
      this.nextRound = parseInt(dataObject['NEXTROUND']);
      this.nextRegen = parseInt(dataObject['NEXTREGEN']);
      debug('Loaded game state from disk.');
    } else {
      this.getElapsedMs = createTimeTracker();
      this.saveDbTime = DBSAVETIME;
      this.nextRound = ROUNDTIME;
      this.nextRegen = REGENTIME;
      debug('Initialized new game state.');
    }
  }

  save() {
    const dataObject = {
      GAMETIME: this.getElapsedMs(),
      SAVEDATABASES: this.saveDbTime,
      NEXTROUND: this.nextRound,
      NEXTREGEN: this.nextRegen,
    };
    jsonfile.writeFileSync(file, dataObject, { spaces: 2 });
    debug(`Game state saved to ${file}`);
    debug('Saved data:', JSON.stringify(dataObject, null, 2));
  }

  saveDatabases() {
    debug('Persisting all databases...');
    this.save();
    this.saveDatabases();
  }

  loop() {
    const now = this.getElapsedMs();

    if (now >= this.nextRound) {
      // debug('Enemy round triggered');
      this.performRound();
      this.nextRound += ROUNDTIME;
    }
    if (now >= this.nextRegen) {
      // debug('Enemy regen triggered');
      this.performRegen();
      this.nextRegen += REGENTIME;
    }
    if (now >= this.saveDbTime) {
      // debug('Saving databases');
      this.saveDatabases();
      this.saveDbTime += DBSAVETIME;
    }
  }

  performRound() {
    const now = this.getElapsedMs();
    for (const enemy of this.databases.enemyDb.values()) {
      if (now >= enemy.nextAttackTime && enemy.room.players.length > 0) {
        debug(`Enemy '${enemy.name}' is attacking in room '${enemy.room.name}'`);
        performAutoAttack(enemy, enemy.room.players[0], now, this.databases);
      }
    }
    for (const player of this.databases.playerDb.values()) {
      if (now >= player.nextAttackTime && player.room.enemies.length > 0) {
        debug(`Player '${player.name}' is attacking in room '${player.room.name}'`);
        performAutoAttack(player, player.room.enemies[0], now, this.databases);
      }
    }
  }

  performRegen() {
    for (const room of this.databases.roomDb.values()) {
      if (room.spawnWhich !== 0 && room.enemies.length < room.maxEnemies) {
        const template = this.databases.enemyTpDb.findById(room.spawnWhich);
        const enemy = this.databases.enemyDb.create(template, room, this.databases);
        sendRoom(room, `${redBold(enemy.name)} enters the room!`);
        debug(`Spawned enemy '${enemy.name}' in room '${room.name}' ${room.id}`);
      }
    }
  }
}

module.exports = GameLoop;
