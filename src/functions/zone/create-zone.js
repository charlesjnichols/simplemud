const _ = require('lodash');
const zone_model = require('../../models/zone');

/**
 * @typedef {import('../../models/zone').Zone} Zone
 */

/**
 *
 * @param {Partial<Zone>} [data={}] - Optional override data for the zone.
 * @returns {Zone} Fully initialized and sealed zone object with attached behavior methods.
 */
function create_zone(data = {}) {
  const zone = _.cloneDeep(zone_model);
  Object.assign(zone, data);

  // TypeScript may not recognize attached runtime fields, so we suppress errors here.
  // @ts-ignore
  return Object.seal(zone);
}
module.exports = { create_zone };
