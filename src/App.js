import React, { Component } from "react";
import logo from "./logo.svg";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import SideBar from "./components/Sidebar";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <BrowserRouter>
          <SideBar />
          <div className="container-fluid container-main">
            <div>assasas</div>
          </div>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

export default App;
