import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import SideBar from "./components/Sidebar";
import SideBarItem from "./_common/SideBarItem";
import Home from "./components/Home";
import Material from "./components/Material";
import Transaction from "./components/Transaction";
import { Grid } from "semantic-ui-react";

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
          <Grid>
            <Grid.Column width={3}>
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
                <SideBarItem
                  path="/transaction"
                  icon="exchange-alt"
                  text="Transaction"
                  showTextSidebarItem={this.state.showTextSidebarItem}
                />
              </SideBar>
            </Grid.Column>
            <Grid.Column width={12}>
              <Route>
                <Switch>
                  <Route path="/home" component={Home} />
                  <Route path="/material" component={Material} />
                  <Route path="/transaction" component={Transaction} />
                  <Redirect from="/" to="/home" />
                </Switch>
              </Route>
            </Grid.Column>
          </Grid>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

export default App;
