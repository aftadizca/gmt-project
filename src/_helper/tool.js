import Enum from "linq";

export function getById(object, id, key) {
  return Enum.from(object)
    .where(x => x.id === id)
    .select(x => x[key]);
}