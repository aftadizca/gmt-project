import { Component } from "react";
import api from "../_helper/api";
import { AppContext } from "../AppProvider";

class Logout extends Component {
  static contextType = AppContext;
  state = {};

  componentDidMount() {
    console.log("LOGOUT MOUNT");
    api
      .get("account/logout")
      .then(response => {
        this.context.setLogin(false);
      })
      .catch(ex => {});
  }
  render() {
    return false;
  }
}

export default Logout;
