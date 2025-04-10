'use strict';

const { SortedMap } = require('insort');

function createEntityDatabase() {
  const map = new SortedMap([], (a, b) => a > b);

  function clear() {
    map.clear();
  }

  function add(entity) {
    const id = findOpenId();
    entity.id = id;
    map.set(id, entity);
  }

  function get(id) {
    return map.get(id);
  }

  function findOpenId() {
    let previousId = 0;
    for (const key of map.keys()) {
      if (key !== previousId + 1) break;
      previousId = key;
    }
    return previousId + 1;
  }

  function findById(id) {
    return map.get(id) || undefined;
  }

  function findByNameFull(name) {
    return _findByName(name, 'matchFull');
  }

  function findByNamePartial(name) {
    return _findByName(name, 'matchPartial');
  }

  function _findByName(name, matchFuncName, filterFn = null) {
    for (const entity of map.values()) {
      const matcher = entity[matchFuncName];
      if (typeof matcher === 'function' && matcher.call(entity, name)) {
        if (!filterFn || filterFn(entity)) {
          return entity;
        }
      }
    }
    return false;
  }

  function hasId(id) {
    return findById(id) !== undefined;
  }

  function hasNameFull(name) {
    return findByNameFull(name) !== false;
  }

  function hasNamePartial(name) {
    return findByNamePartial(name) !== false;
  }

  function size() {
    return map.size;
  }

  return {
    add,
    get,
    findById,
    findByNameFull,
    findByNamePartial,
    hasId,
    hasNameFull,
    hasNamePartial,
    size,
    findOpenId,
    clear,
  };
}

module.exports = createEntityDatabase;
