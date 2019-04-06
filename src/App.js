import React, { Component } from "react";
import logo from "./logo.svg";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import SideBar from "./components/Sidebar";
import SideBarItem from "./components/SideBarItem";

class App extends Component {
  state = { showTextSidebarItem: false };

  handleMouseEnterSideBar = () => {
    this.setState({ showTextSidebarItem: true });
    //console.log("mouse enter", this.state.showTextSidebarItem);
  };
  handleMouseLeaveSideBar = () => {
    this.setState({ showTextSidebarItem: false });
    //console.log("mouse leave", this.state.showTextSidebarItem);
  };

  render() {
    return (
      <React.Fragment>
        <BrowserRouter>
          <SideBar
            onMouseEnter={this.handleMouseEnterSideBar}
            onMouseLeave={this.handleMouseLeaveSideBar}
          >
            <SideBarItem
              path="/home"
              icon="home"
              text="Home"
              showTextSidebarItem={this.state.showTextSidebarItem}
            />
            <SideBarItem
              path="/material"
              icon="boxes"
              text="Material"
              showTextSidebarItem={this.state.showTextSidebarItem}
            />
          </SideBar>
          <div className="container-fluid container-main">
            <div>assasas</div>
          </div>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

export default App;
