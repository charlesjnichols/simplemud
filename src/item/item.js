'use strict';

const { Attribute, ItemType } = require('../attributes');
const { matchFull, matchPartial } = require('.././utils/matcher');

function createItem(data = {}) {
  const type = ItemType.get(data.TYPE) || ItemType.get('WEAPON');

  const attributes = Attribute.enums.reduce((acc, attr) => {
    const val = parseInt(data[attr.key]);
    acc[attr.value] = isNaN(val) ? 0 : val;
    return acc;
  }, []);

  const item = {
    id: data.ID,
    name: data.NAME || 'Unnamed Item',
    type,
    min: parseInt(data.MIN) || 0,
    max: parseInt(data.MAX) || 0,
    speed: parseInt(data.SPEED) || 0,
    price: parseInt(data.PRICE) || 0,
    attributes,
    matchFull: (str) => matchFull(data.NAME || '', str),
    matchPartial: (str) => matchPartial(data.NAME || '', str),
  };

  return item;
}

module.exports = createItem;
