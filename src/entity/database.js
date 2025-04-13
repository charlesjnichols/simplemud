'use strict';

const { SortedMap } = require('insort');
const _ = require('lodash');

const createEntityDatabase = () => {
  const map = new SortedMap();

  const add = (entity) => map.set(entity.id, entity);
  const get = (id) => map.get(id);
  const findById = (id) => map.get(id);

  const findByNameFull = (name, filter) => {
    const lower = name.toLowerCase();
    return _.find([...map.values()], (e) => e.name?.toLowerCase() === lower && (!filter || filter(e))) ?? null;
  };

  const findByNamePartial = (name, filter) => {
    const lower = name.toLowerCase();
    return _.find([...map.values()], (e) => e.name?.toLowerCase().includes(lower) && (!filter || filter(e))) ?? null;
  };

  const findByRank = (rank, filter) => {
    return _.find([...map.values()], (e) => e.rank === rank && (!filter || filter(e))) ?? null;
  };

  const hasId = (id) => map.has(id);
  const hasNameFull = (name) => Boolean(findByNameFull(name));
  const hasNamePartial = (name) => Boolean(findByNamePartial(name));

  const findOpenId = () => _.find(_.range(1, Number.MAX_SAFE_INTEGER), (id) => !map.has(id)) ?? 1;

  const clear = () => map.clear();
  const values = () => [...map.values()];
  const keys = () => map.keys();
  const size = () => map.size;
  const remove = (key) => map.delete(key);

  return {
    add,
    get,
    delete: remove,
    findById,
    findByNameFull,
    findByNamePartial,
    findByRank,
    hasId,
    hasNameFull,
    hasNamePartial,
    findOpenId,
    clear,
    values,
    keys,
    size,
  };
};

module.exports = createEntityDatabase;
