import Swal from "sweetalert2";

export const DeleteAlert = Swal.mixin({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  type: "warning",
  focusCancel: true,
  showCancelButton: true,
  confirmButtonText: "Delete it!",
  customClass: {
    container: "ui page modals dimmer transition active",
    body: "dimmable dimmed blurring scrolling"
  }
});

export const Loading = Swal.mixin({
  title: false,
  html:
    '<div style="width:100%;height:100%" class="lds-facebook"><div></div><div></div><div></div>',
  type: false,
  width: 200,
  showCancelButton: false,
  showConfirmButton: false,
  background: "#00000000",
  allowOutsideClick: false,
  costumClass: {
    content: "center"
  }
});

export const Toast = (type, message, timer = 5000) =>
  Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: timer,
    type: type,
    title: message,
    background: "#f3f4f5",
    padding: "2rem"
  });
