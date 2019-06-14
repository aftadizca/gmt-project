import { Line, defaults } from "react-chartjs-2";
import { StyleSheet } from "@react-pdf/renderer";

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
  graphs: "graphs",
  materialouts: "materialouts"
});

//#region ACTION MODAL
export const STOK = Object.freeze({
  edit: "STOK_EDIT",
  updateQC: "UPDATE_QC"
});

export const INCOMING = Object.freeze({
  add: "INCOMING_ADD",
  edit: "INCOMING_EDIT",
  updateQC: "UPDATE_QC"
});
export const OUTCOMING = Object.freeze({
  view: "OUTCOMING_VIEW",
  add: "OUTCOMING_ADD",
  addMaterial: "OUTCOMING_ADDMAT",
  closeSecondModal: "OUTCOMING_C",
  edit: "OUTCOMING_EDIT",
  delete: "OUTCOMING_EDIT"
});
//#endregion

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

export const NEW_STOK = {
  expiredDate: "",
  lot: "",
  materialID: "",
  qty: null,
  pallet: null
};

export const NEW_INCOMING = {
  receiverName: "",
  receiverDepartement: "",
  stokMaterialOut: []
};

export const MODAL_DEFAULT = {
  firstModal: { active: "", error: "" },
  secondModal: { active: "", error: "" }
};

export const PDF_STYLE = StyleSheet.create({
  page: {
    padding: "50pt"
  },
  container: {
    flexDirection: "row"
  },
  column: {
    display: "flex",
    boxSizing: "border-box",
    flexGrow: 1,
    alignItems: "stretch",
    justifyContent: "stretch",
    flexDirection: "column"
  },
  document: {
    backgroundColor: "#000"
  },
  cell: {
    border: "0.5pt",
    boxSizing: "border-box",
    padding: "3pt",
    alignItems: "stretch",
    justifyContent: "stretch",
    fontWeight: "normal",
    fontSize: "8pt"
  },
  label: {
    boxSizing: "border-box",
    padding: "3pt",
    alignItems: "stretch",
    justifyContent: "stretch",
    fontWeight: "normal",
    fontSize: "8pt",
    flexGrow: 1
  },
  labelValue: {
    boxSizing: "border-box",
    padding: "3pt",
    justifyContent: "stretch",
    fontWeight: "normal",
    fontSize: "8pt",
    flexGrow: 2
  },
  header: {
    border: "0.5pt",
    boxSizing: "border-box",
    alignItems: "stretch",
    justifyContent: "stretch",
    padding: "3pt",
    fontWeight: "bolder",
    fontSize: "8pt",
    backgroundColor: "#0277bd"
  },
  pageCount: {
    position: "absolute",
    bottom: "25pt",
    right: "50pt",
    fontSize: "8pt"
  },
  title: {
    position: "absolute",
    top: "25pt",
    left: "50pt",
    fontSize: "8pt"
  }
});

//#region LINE CHART SETTING
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
export { Line };
//#endregion
