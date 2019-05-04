import _ from "lodash";

// /**
//  * Get property from other object
//  * @param {Object} object Target object
//  * @param {String} key Key of target to find
//  * @param {String || Int} value Value of target to find
//  * @param {String} returnedKey Return Target
//  */

// export function getByProperty(object, key, value, returnedKey) {
//   console.time("getByProperty");
//   if (object.length === 0) {
//     return;
//   }
//   if (value) {
//     var r = _.find(object, { [key]: value });
//     console.timeEnd("getByProperty");
//     return r[returnedKey];
//   }
//   console.timeEnd("getByProperty");
//   return "-";
// }

/**
 * Remove multiple item from array
 * @param {Array} target array target
 * @param {Array} filter array to remove from target
 */
export function filterWithArray(target, filter, key) {
  let tar = _.cloneDeep(target);
  _.map(filter, item => {
    if (key) {
      return _.remove(tar, x => x[key] === item[key]);
    }
    return _.remove(tar, item);
  });
  return tar;
}
