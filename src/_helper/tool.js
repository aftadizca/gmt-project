import Enum from "linq";
import _ from "lodash";

/**
 *
 * @param {Array} object Array Object
 * @param {any} id id of Target
 * @param {string} key key of Target that need
 */
export function getById(object, id, key) {
  if (id) {
    console.time("getById");
    var r =
      Enum.from(object)
        .where(x => x.id === id)
        .select(x => x[key])
        .toJoinedString() || "-";
    console.timeEnd("getById");
    return r;
  }
}

/**
 * Get property from other object
 * @param {Object} object Target object
 * @param {String} key Key of target to find
 * @param {String || Int} value Value of target to find
 * @param {String} returnedKey Return Target
 */
export function getByProperty(object, key, value, returnedKey) {
  if (value) {
    var r = _.find(object, { [key]: value });
    // console.timeEnd("getByProperty");
    return r[returnedKey];
  }
  return "-";
}

export function filterWithArray(target, filter) {
  //console.time("filterWithArray");
  let tar = [...target];
  _.map(filter, item => {
    return _.remove(tar, item);
  });
  //console.timeEnd("filterWithArray");
  return tar;
}
