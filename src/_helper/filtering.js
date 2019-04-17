import _ from "lodash";

export default function Filtering(data, filterText) {
  if (data.length !== 0 && filterText.trim() !== "") {
    const a = Object.keys(data[0]);
    var x = data.filter(d => {
      var temp = {};

      a.map(x => {
        if (
          d[x]
            .toString()
            .toLowerCase()
            .includes(filterText.toString().toLowerCase())
        ) {
          temp = d;
        }
        return null;
      });
      return _.isEqual(d, temp);
    });
    return x;
  } else {
    return data;
  }
}
