import React, { Component } from "react";
import MySideBar from "./Sidebar";
import { AppContext } from "../AppProvider";

class Loader extends Component {
  static contextType = AppContext;
  state = {};

  componentDidMount() {
    this.context.loadResource();
  }
  render() {
    return <MySideBar />;
  }
}

export default Loader;
