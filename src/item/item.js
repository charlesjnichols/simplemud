'use strict';

const { Attribute, ItemType } = require('../attributes');

function createItem(data = {}) {
  const type = ItemType.get(data.TYPE) || ItemType.get('WEAPON');

  const attributes = _.mapValues(Attribute, (key) => {
    const val = parseInt(data[key]);
    return isNaN(val) ? 0 : val;
  });

  const item = {
    id: data.ID,
    name: data.NAME || 'Unnamed Item',
    type,
    min: parseInt(data.MIN) || 0,
    max: parseInt(data.MAX) || 0,
    speed: parseInt(data.SPEED) || 0,
    price: parseInt(data.PRICE) || 0,
    attributes,
  };

  return item;
}

module.exports = createItem;
