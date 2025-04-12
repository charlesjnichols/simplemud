// src/store/messages.js
'use strict';

const { whiteBold, cyanBold, yellow, center, green, padRight, padLeft, cyan, white } = require('../utils/formatting');

const createStoreMessages = (store) => {
  const printStoreList = () => {
    const divider = '-'.repeat(80);
    const columnWidthName = 33;
    const columnWidthPrice = 10;

    const headerLines = [
      divider,
      center(green(`Welcome to ${store.name}!`), 80),
      divider,
      padRight(cyan('Item'), columnWidthName) + ' | ' + padLeft(cyan('Price'), columnWidthPrice),
      divider,
    ];

    const itemLines = store.items.map((item) => {
      const name = yellow(padRight(item.name, columnWidthName));
      const price = white(padLeft(`$${item.price}`, columnWidthPrice));
      return ` ${name} | ${price}`;
    });

    const footerLine = divider;

    return whiteBold([...headerLines, ...itemLines, footerLine].join('\r\n'));
  };

  return {
    buy: (playerName, itemName) => cyanBold(`${playerName} buys a ${itemName}`),
    sell: (playerName, itemName) => cyanBold(`${playerName} sells a ${itemName}`),
    pickUpItem: (playerName, itemName) => cyanBold(`${playerName} picks up ${itemName}.`),
    dropItem: (playerName, itemName) => cyanBold(`${playerName} drops ${itemName}.`),
    pickUpMoney: (playerName, amount) => cyanBold(`${playerName} picks up $${amount}.`),
    dropMoney: (playerName, amount) => cyanBold(`${playerName} drops $${amount}.`),
    printStoreList,
  };
};

module.exports = {
  createStoreMessages,
};
