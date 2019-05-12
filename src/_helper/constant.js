export const TITLE = "GUDANG MATERIAL APP";

export const STATUS_COLOR = Object.freeze({
  1: "grey",
  2: "green",
  3: "yellow",
  4: "red"
});

export const LOCALE_DATE = "id-ID";

export const OPTIONS_DATE = Object.freeze({
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
});

export const CLEAVE_DATE_OPTIONS = Object.freeze({
  date: {
    date: true,
    delimiter: "/",
    datePattern: ["m", "d", "Y"]
  },
  numeric: {
    numeral: true,
    numeralThousandsGroupStyle: "thousand"
  }
});

export const DB = Object.freeze({
  materials: "materials",
  statusQCs: "statusQCs",
  locationmaps: "locationmaps",
  locations: "locations",
  stoks: "stoks"
});

export const STOK = Object.freeze({
  edit: "STOK_EDIT",
  updateQC: "UPDATE_QC"
});

export const INCOMING = Object.freeze({
  add: "INCOMING_ADD",
  edit: "INCOMING_EDIT",
  updateQC: "UPDATE_QC"
});

export const TAB = Object.freeze({
  transaction: {
    stok: 0,
    incoming: 1,
    outcoming: 2
  }
});

export const MONTH_NAME = Object.freeze([
  "January",
  "February",
  "Maret",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]);
