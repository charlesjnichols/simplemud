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

  /**
   * Adds an entity to the cache.
   * @param {T & { id: string }} entity The entity to add.
   */
  const add = (entity) => map.set(entity.id, entity);

  /**
   * Retrieves an entity from the cache by ID.
   * @param {string} id The ID of the entity to retrieve.
   * @returns {T | undefined} The entity, or undefined if not found.
   */
  const get = (id) => map.get(id);

  /**
   * Finds an entity by its full name.
   * @param {string} name The full name of the entity to find.
   * @param {function(T): boolean} [filter] An optional filter function.
   * @returns {T | null} The entity if found, otherwise null.
   */
  const find_by_full_name = (name, filter) => {
    const lower = name.toLowerCase();
    return _.find([...map.values()], (e) => e.name?.toLowerCase() === lower && (!filter || filter(e))) ?? null;
  };

  /**
   * Finds an entity by a partial name match.
   * @param {string} name The partial name to search for.
   * @param {function(T): boolean} [filter] An optional filter function.
   * @returns {T | null} The entity if found, otherwise null.
   */
  const find_by_partial_name = (name, filter) => {
    const lower = name.toLowerCase();
    return _.find([...map.values()], (e) => e.name?.toLowerCase().includes(lower) && (!filter || filter(e))) ?? null;
  };

  /**
   * Finds an entity by its rank.
   *
   * @param {import("../config").PlayerRank} rank The rank to search for.
   * @param {function(T): boolean} [filter] An optional filter function.
   * @returns {T | null} The entity if found, otherwise null.
   */
  const find_by_rank = (rank, filter) => {
    return _.find([...map.values()], (e) => e.rank === rank && (!filter || filter(e))) ?? null;
  };

  /**
   * Checks if an entity with the given ID exists in the cache.
   * @param {string} id The ID to check.
   * @returns {boolean} True if the entity exists, false otherwise.
   */
  const has = (id) => map.has(id);

  /**
   * Checks if an entity with the given full name exists in the cache.
   * @param {string} name The full name to check.
   * @returns {boolean} True if the entity exists, false otherwise.
   */
  const has_full_name = (name) => Boolean(find_by_full_name(name));

  /**
   * Checks if an entity with the given partial name exists in the cache.
   * @param {string} name The partial name to check.
   * @returns {boolean} True if the entity exists, false otherwise.
   */
  const has_partial_name = (name) => Boolean(find_by_partial_name(name));

  /**
   * Finds all entities, excluding one with a specific ID.
   * @param {string | null} [excludeId=null] The ID to exclude.
   * @returns {T[]} An array of entities.
   */
  const find_by = (excludeId = null) => {
    return [...map.values()].filter((p) => p.id !== excludeId);
  };

  /**
   * Clears all entities from the cache.
   */
  const clear = () => map.clear();

  /**
   * Returns all entities in the cache as an array.
   * @returns {T[]} An array of entities.
   */
  const values = () => [...map.values()];

  /**
   * Returns an iterator over the keys (IDs) in the cache.
   * @returns {IterableIterator<string>} An iterator over the keys.
   */
  const keys = () => map.keys();

  /**
   * Returns the number of entities in the cache.
   * @returns {number} The number of entities.
   */
  const size = () => map.size;

  /**
   * Removes an entity from the cache by its ID.
   * @param {string} key The ID of the entity to remove.
   */
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
