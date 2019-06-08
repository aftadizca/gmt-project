export default function Filtering(data, rowBuilder, filterText, index) {
  //console.time("filtering");
  if (data.length !== 0 && filterText.trim() !== "") {
    var x = data.filter((d, i) => {
      const row = rowBuilder(d, i).cells[index];
      const rowSelect = typeof row === "object" ? row.content : row;
      const regex = new RegExp(filterText, "i");
      return regex.test(rowSelect.toString());
    });
    //console.timeEnd("filtering");
    return x;
  } else {
    //console.timeEnd("filtering");
    return false;
  }
}
