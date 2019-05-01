import _ from "lodash";

// /**
//  *
//  * @param {Array} object Array Object
//  * @param {any} id id of Target
//  * @param {string} key key of Target that need
//  */
// export function getById(object, id, key) {
//   if (id) {
//     console.time("getById");
//     var r =
//       Enum.from(object)
//         .where(x => x.id === id)
//         .select(x => x[key])
//         .toJoinedString() || "-";
//     console.timeEnd("getById");
//     return r;
//   }
// }

/**
 * Get property from other object
 * @param {Object} object Target object
 * @param {String} key Key of target to find
 * @param {String || Int} value Value of target to find
 * @param {String} returnedKey Return Target
 */

export function getByProperty(object, key, value, returnedKey) {
  //console.log({ object, key, value, returnedKey });
  if (object.length === 0) {
    return;
  }
  if (value) {
    var r = _.find(object, { [key]: value });
    return r[returnedKey];
  }
  return "-";
}

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
