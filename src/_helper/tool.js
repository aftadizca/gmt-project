import Enum from "linq";
import _ from "lodash";

export function getById(object, id, key) {
  return (
    Enum.from(object)
      .where(x => x.id === id)
      .select(x => x[key])
      .toJoinedString() || "-"
  );
}

export function filterWithArray(target, filter) {
  let tar = [...target];
  _.map(filter, item => {
    return _.remove(tar, item);
  });
  return tar;
}
