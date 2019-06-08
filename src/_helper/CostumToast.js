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
  allowOutsideClick: false
});

export const Toast = (message, type = "success", timer = 5000) =>
  Swal.mixin({
    toast: true,
    position: "bottom-start",
    showConfirmButton: false,
    timer: timer,
    type: type,
    title: message,
    background: "rgba(50, 50, 50, 0.85)",
    padding: "10px",
    customClass: {
      title: "toast-title"
    }
  }).fire();
