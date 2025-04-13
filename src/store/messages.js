// src/store/messages.js
'use strict';

const { whiteBold, cyanBold, yellow, center, green, padRight, padLeft, cyan, white } = require('../utils/formatting');

const createStoreMessages = () => {
  return {
    buy: (playerName, itemName) => cyanBold(`${playerName} buys a ${itemName}`),
    sell: (playerName, itemName) => cyanBold(`${playerName} sells a ${itemName}`),
    pickUpItem: (playerName, itemName) => cyanBold(`${playerName} picks up ${itemName}.`),
    dropItem: (playerName, itemName) => cyanBold(`${playerName} drops ${itemName}.`),
    pickUpMoney: (playerName, amount) => cyanBold(`${playerName} picks up $${amount}.`),
    dropMoney: (playerName, amount) => cyanBold(`${playerName} drops $${amount}.`),
  };
};

module.exports = {
  createStoreMessages,
};
