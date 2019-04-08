import _ from "lodash";

export default function Filtering(data, filterText) {
  if (data.length !== 0 && filterText.trim() !== "") {
    const a = Object.keys(data[0]);
    var x = data.filter(d => {
      var temp = {};

      a.map(x => {
        if (d[x].toLowerCase().includes(filterText.toLowerCase())) {
          temp = d;
        }
      });
      return _.isEqual(d, temp);
    });
    return x;
  } else {
    return data;
  }
}
