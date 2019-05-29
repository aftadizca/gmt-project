import _ from "lodash";
import { Loading } from "./CostumToast";

/**
 * Remove multiple item from array
 * @param {Array} target array target
 * @param {Array} filter array to remove from target
 */
export function filterWithArray(target, filter, keyX, keyY) {
  Loading.fire();
  let result = [];
  _.each(filter, x => {
    _.each(target, y => {
      if (x[keyY] === y[keyX]) {
        result.push(y);
        return false;
      }
    });
  });
  Loading.close();
  return result;
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
