import _ from "lodash";

export default function Filtering(data, rowBuilder, filterText) {
  console.time("filtering");
  if (data.length !== 0 && filterText.trim() !== "") {
    var x = data.filter((d, i) => {
      let row = rowBuilder(d, i);
      let found = false;
      _.forEach(row.cells, (x, i2) => {
        if (traverseSearch(x, filterText)) {
          found = true;
          return false;
        }
        return !found;
      });
      return found;
    });
    console.timeEnd("filtering");
    return x;
  } else {
    console.timeEnd("filtering");
    return false;
  }
}

function traverseSearch(object, search) {
  if (typeof object === "string" || typeof object === "number") {
    if (
      object
        .toString()
        .toLowerCase()
        .includes(search.toString().toLowerCase())
    ) {
      return true;
    }
  } else {
  }
  if (typeof object === "object") {
    if (typeof object.content === "object") {
      return false;
    }
    if (
      object.content
        .toString()
        .toLowerCase()
        .includes(search.toString().toLowerCase())
    ) {
      return true;
    }
  }
  return false;
}
