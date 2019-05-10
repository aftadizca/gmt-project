import _ from "lodash";

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

export function checkForm(data) {
  let valid = true;
  data &&
    Object.keys(data).forEach(x => {
      if (Number.isInteger(data[x])) {
      } else {
        if (
          data[x] === "" ||
          data[x] === null ||
          data[x] === undefined ||
          data[x].toString() === "NaN"
        ) {
          valid = false;
        }
      }
    });
  return valid;
}
