import React, { Component } from "react";
import { br } from "react-router-dom";
import { AppContext } from "../AppProvider";
import api from "../_helper/api";

class HomeLogin extends Component {
  static contextType = AppContext;
  state = {};

  componentDidMount() {
    api
      .get("account")
      .then(response => {
        if (response.status === 200) this.context.setLogin(true);
      })
      .catch(errors => {
        this.context.setLogin(false);
      });
  }

  render() {
    return null;
  }
}

export default HomeLogin;
