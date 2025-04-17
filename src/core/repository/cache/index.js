/**
 * @module repository/entity-cache
 *
 * Provides a sorted in-memory cache for entities using a SortedMap.
 * Supports lookup by ID, name, rank, and includes utilities for open ID detection and filtering.
 */

'use strict';

const { SortedMap } = require('insort');
const _ = require('lodash');

/**
 * Creates a new entity cache with sorted access and various lookup helpers.
 *
 * @template T
 * @returns {{
 *   add: (entity: T & { id: string }) => void,
 *   get: (id: string) => T | undefined,
 *   delete: (id: string) => boolean,
 *   get: (id: string) => T | undefined,
 *   find_by: (excludeId?: string|null) => T[],
 *   find_by_full_name: (name: string, filter?: (e: T) => boolean) => T | null,
 *   find_by_partial_name: (name: string, filter?: (e: T) => boolean) => T | null,
 *   find_by_rank: (rank: any, filter?: (e: T) => boolean) => T | null,
 *   has: (id: string) => boolean,
 *   has_full_name: (name: string) => boolean,
 *   has_partial_name: (name: string) => boolean,
 *   clear: () => void,
 *   values: () => T[],
 *   keys: () => IterableIterator<string>,
 *   size: () => number,
 * }} A sorted entity cache API for entity storage and retrieval.
 */
const create_entity_cache = () => {
  const map = new SortedMap();

  const add = (entity) => map.set(entity.id, entity);
  const get = (id) => map.get(id);

  const find_by_full_name = (name, filter) => {
    const lower = name.toLowerCase();
    return _.find([...map.values()], (e) => e.name?.toLowerCase() === lower && (!filter || filter(e))) ?? null;
  };

  const find_by_partial_name = (name, filter) => {
    const lower = name.toLowerCase();
    return _.find([...map.values()], (e) => e.name?.toLowerCase().includes(lower) && (!filter || filter(e))) ?? null;
  };

  const find_by_rank = (rank, filter) => {
    return _.find([...map.values()], (e) => e.rank === rank && (!filter || filter(e))) ?? null;
  };

  const has = (id) => map.has(id);
  const has_full_name = (name) => Boolean(find_by_full_name(name));
  const has_partial_name = (name) => Boolean(find_by_partial_name(name));

  const find_by = (excludeId = null) => {
    return [...map.values()].filter((p) => p.id !== excludeId);
  };

  const clear = () => map.clear();
  const values = () => [...map.values()];
  const keys = () => map.keys();
  const size = () => map.size;
  const remove = (key) => map.delete(key);

  return {
    add,
    get,
    delete: remove,
    find_by,
    find_by_full_name,
    find_by_partial_name,
    find_by_rank,
    has,
    has_full_name,
    has_partial_name,
    clear,
    values,
    keys,
    size,
  };
};

module.exports = { create_entity_cache };
