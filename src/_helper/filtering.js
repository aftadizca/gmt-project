import _ from "lodash";

export default function Filtering(data, rowBuilder, filterText, index) {
  console.time("filtering");
  if (data.length !== 0 && filterText.trim() !== "") {
    var x = data.filter((d, i) => {
      const row = rowBuilder(d, i).cells[index];
      const rowSelect = typeof row === "object" ? row.content : row;
      const regex = new RegExp(filterText, "i");
      return regex.test(rowSelect.toString());
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
        .toUpperCase()
        .includes(search.toString().toUpperCase())
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
        .toUpperCase()
        .includes(search.toString().toUpperCase())
    ) {
      return true;
    }
  }
  return false;
}
