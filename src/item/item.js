'use strict';
const _ = require('lodash');

function createItem(data = {}) {
  const type = data.TYPE;

  const item = {
    id: data.ID,
    name: data.NAME || 'Unnamed Item',
    type,
    min: parseInt(data.MIN) || 0,
    max: parseInt(data.MAX) || 0,
    speed: parseInt(data.SPEED) || 0,
    price: parseInt(data.PRICE) || 0,
  };

  return item;
}

module.exports = createItem;
