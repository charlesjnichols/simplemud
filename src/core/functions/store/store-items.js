const { create_item } = require('../item/create-item');

function list_store_items(store, itemStore) {
  const items = store.item_ids.map((id) => create_item(itemStore.findById(id)));
  return items;
}

module.exports = {
  list_store_items,
};
