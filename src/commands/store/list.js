const { whiteBold, yellow, center, green, padRight, padLeft, cyan, white } = require('../../utils/formatting');

module.exports = (player) => {
  const store = player.room.store;

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

  player.send(whiteBold([...headerLines, ...itemLines, footerLine].join('\r\n')));
};
