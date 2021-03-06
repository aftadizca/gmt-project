export const PageSize = [
  { value: 10, text: 10 },
  { value: 20, text: 20 },
  { value: 30, text: 30 },
  { value: 50, text: 50 }
];

export const UnitList = [
  { key: 1, value: "PCS", text: "PCS" },
  { key: 2, value: "ROLL", text: "ROLL" },
  { key: 3, value: "PACK", text: "PACK" },
  { key: 4, value: "KG", text: "KG" },
  { key: 5, value: "LITER", text: "LITER" }
];

export const TypeList = [
  { key: 1, value: "DUS", text: "DUS " },
  { key: 2, value: "SEAL", text: "SEAL" },
  { key: 3, value: "CUP", text: "CUP" },
  { key: 4, value: "LAKBAN", text: "LAKBAN" },
  { key: 5, value: "SEDOTAN", text: "SEDOTAN" }
];

/**P
 * Create list for Dropdown
 * @param {Array} data
 * @param {String} value Value of List
 * @param {Function} text Display list
 */
export function DinamicList(
  data,
  value,
  text,
  index = false,
  label = { circular: true, empty: true, color: "blue" }
) {
  try {
    return data
      .filter(x => x[value] !== undefined && x.skip !== "true")
      .map((x, i) => {
        return { key: i, value: index ? i : x[value], text: text(x), label };
      });
  } catch (error) {
    console.log(error);
  }
}
