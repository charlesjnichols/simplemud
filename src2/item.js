'use strict';

const Entity = require('./entity');
const { Attribute, ItemType } = require('./attributes');

class Item extends Entity {
  constructor() {
    super();
    this.type = ItemType.get('WEAPON');
    this.min = 0;
    this.max = 0;
    this.speed = 0;
    this.price = 0;
    this.attributes = [];
  }

  load(dataObject) {
    this.id = parseInt(dataObject.ID);
    this.name = dataObject.NAME || 'Unnamed Item';

    const type = ItemType.get(dataObject.TYPE);
    this.type = type || null;

    this.min = parseInt(dataObject.MIN) || 0;
    this.max = parseInt(dataObject.MAX) || 0;
    this.speed = parseInt(dataObject.SPEED) || 0;
    this.price = parseInt(dataObject.PRICE) || 0;

    // Load attributes by attribute key
    Attribute.enums.forEach(attr => {
      const val = parseInt(dataObject[attr.key]);
      this.attributes[attr] = isNaN(val) ? 0 : val;
    });
  }
}

module.exports = Item;
