// eslint-disable-next-line no-unused-vars
const { matchFull, matchPartial } = require('../utils/matcher');
const { createStoreMessages } = require('./messages');

function createStore(data = {}) {
  const store = {
    id: data.ID ? parseInt(data.ID) : null,
    name: data.NAME || 'Unnamed Store',
    items: [],
  };

  store.messages = createStoreMessages();

  const _findIn = (collection, name) => {
    const match = (fn) => collection.find((obj) => obj?.[fn]?.call(obj, name)) || 0;
    return match('matchFull') || match('matchPartial');
  };

  return Object.assign(store, {
    findItem: (itemName) => _findIn(store.items, itemName),

    load: (dataObject, { itemDb }) => {
      store.id = parseInt(dataObject.ID);
      store.name = dataObject.NAME;
      store.items = [];

      dataObject.ITEMS.split(' ').forEach((idStr) => {
        const id = parseInt(idStr);
        if (!id) return;
        const item = itemDb.findById(id);
        if (item) store.items.push(item);
      });
    },
  });
}

module.exports = createStore;
