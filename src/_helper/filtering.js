import _ from "lodash";

export default function Filtering(data, rowBuilder, filterText) {
  console.time("filtering");
  if (data.length !== 0 && filterText.trim() !== "") {
    let index = -1;
    var x = data.filter((d, i) => {
      let row = rowBuilder(d, i);
      let found = false;
      if (index > -1) {
        if (traverseSearch(row.cells[index], filterText)) {
          found = true;
        }
      } else {
        _.forEach(row.cells, (x, i) => {
          if (traverseSearch(x, filterText)) {
            index = i;
            found = true;
            return false;
          }
        });
      }
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
