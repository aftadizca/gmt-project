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

export function gradien(canvas, r, g, b) {
  const ctx = canvas.getContext("2d");
  const grd = ctx.createLinearGradient(0, 0, 0, 400);
  // Add colors
  grd.addColorStop(0.0, `rgba(${r}, ${g}, ${b}, 1.000)`);
  grd.addColorStop(0.376, `rgba(${r}, ${g}, ${b}, 0.702)`);
  grd.addColorStop(0.582, `rgba(${r}, ${g}, ${b}, 0.498)`);
  grd.addColorStop(1.0, `rgba(${r}, ${g}, ${b}, 0.000)`);
  return grd;
}
