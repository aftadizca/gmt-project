import { Toast, Loading } from "./CostumToast";

export function apiErrorHandle(error) {
  if (error.response) {
    Loading.close();
    console.log("ERROR", error.response);
    if (error.response.status === 400) {
      this.setState({
        editMaterialError: true,
        editMaterialErrorMsg: error.response.data.error
      });
    } else if (error.response.status >= 500) {
      Toast("Server Error!", "error").fire();
    }
  }
}
