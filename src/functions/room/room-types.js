/**
 * @typedef {object} Room
 *
 * Core Properties:
 * @property {number} id - Unique identifier for the room.
 * @property {string} name - Name of the room.
 * @property {string} description - Room description shown to playerRepository.
 * @property {string} type - Room type (e.g. 'PLAIN', 'STORE').
 * @property {number} money - Amount of gold/money on the ground.
 * @property {Array<object>} items - Items present in the room.
 *
 * Directional Links:
 * @property {Object<string, number>} roomRepository - Mapping of direction keys (e.g. 'NORTH') to room IDs (or 0).
 *
 * Runtime Behaviors:
 * @property {(item: object) => void} add_item - Adds an item to the room.
 * @property {(item: object) => void} remove_item - Removes an item from the room.
 * @property {(itemsDb: any) => string} get_items - Returns a string listing the items and money in the room.
 * @property {() => string} get_exits - Returns a string of available exits (e.g. 'NORTH  EAST').
 * @property {() => boolean} is_in_store - Returns true if the room is a store.
 * @property {(list: Array<{ name: string }>, colorFn: (text: string) => string, label: string) => string} get_names - Formats a labeled name list (e.g. mobRepository or playerRepository).
 */
module.exports = {};
