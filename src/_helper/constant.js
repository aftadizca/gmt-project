import { Line, defaults } from "react-chartjs-2";

export const TITLE = "GUDANG MATERIAL APP";

export const STATUS_COLOR = Object.freeze({
  1: "grey",
  2: "green",
  3: "yellow",
  4: "red"
});

export const LOCALE_DATE = "en-En";

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
  stoks: "stoks",
  graphs: "graphs"
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
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEPT",
  "OCT",
  "NOV",
  "DEC"
]);

defaults.global.defaultFontFamily = "'Nanum Gothic', sans-serif";
defaults.global.defaultFontStyle = "bold";
defaults.global.elements.line.borderWidth = 2;
defaults.global.elements.point.pointStyle = "crossRot";
defaults.global.elements.point.radius = 5;
defaults.global.elements.point.hoverRadius = 10;
defaults.global.animation.easing = "easeOutBounce";
defaults.global.tooltips.backgroundColor = "rgba(0,0,0,0.7)";
defaults.scale.gridLines.drawBorder = false;
defaults.scale.gridLines.drawTicks = false;
defaults.scale.gridLines.color = "rgba(33, 133, 208, .2)";
defaults.scale.ticks.padding = 20;
defaults.line.scales.xAxes[0] = {
  ...defaults.line.scales.xAxes[0],
  gridLines: { display: false }
};
console.log({ defaults });
export { Line };
