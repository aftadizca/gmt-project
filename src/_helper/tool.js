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
      if (
        data[x] === "" ||
        data[x] === null ||
        data[x] === undefined ||
        data[x].toString() === "NaN" ||
        data[x] === 0
      ) {
        valid = false;
      }
    });
  return valid;
}

export function randomRgba(tranparensy) {
  var o = Math.round,
    r = Math.random,
    s = 255;
  return (
    "rgba(" + o(r() * s) + "," + o(r() * s) + ",255," + tranparensy ||
    r().toFixed(1) + ")"
  );
}
