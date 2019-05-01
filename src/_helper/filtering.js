import _ from "lodash";

export default function Filtering(data, rowBuilder, filterText) {
  //console.time("filtering");
  if (data.length !== 0 && filterText.trim() !== "") {
    //const a = Object.keys(data[0]);
    var x = data.filter((d, i) => {
      let row = rowBuilder(d, i);
      //console.log(row);
      let found = false;
      _.forEach(row.cells, x => {
        if (traverseSearch(x, filterText)) {
          found = true;
          return false;
        }
      });
      return found;
    });

    //console.log({ x });
    //console.timeEnd("filtering");
    return x;
  } else {
    //console.timeEnd("filtering");
    return data;
  }
}

function traverseSearch(object, search) {
  if (typeof object === "string") {
    if (
      object
        .toString()
        .toLowerCase()
        .includes(search.toString().toLowerCase())
    ) {
      return true;
    } else {
      return false;
    }
  } else {
  }
  if (typeof object === "object") {
    if (
      object.content
        .toString()
        .toLowerCase()
        .includes(search.toString().toLowerCase())
    ) {
      return true;
    } else {
      return false;
    }
  }
}
