import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import SideBar from "./components/Sidebar";
import SideBarItem from "./_common/SideBarItem";
import Home from "./components/Home";
import Material from "./components/Material";
import Transaction from "./components/Transaction";
import Other from "./components/Other";
import { Grid } from "semantic-ui-react";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <BrowserRouter>
          <div style={{ marginTop: 20 }} />
          <Grid>
            <Grid.Column width={2}>
              <SideBar>
                <SideBarItem path="/home" icon="home" text="Home" />
                <SideBarItem path="/material" icon="boxes" text="Material" />
                <SideBarItem
                  path="/transaction"
                  icon="exchange"
                  text="Transaction"
                />
                <SideBarItem path="/other" icon="settings" text="Other" />
              </SideBar>
            </Grid.Column>
            <Grid.Column width={13}>
              <Route>
                <Switch>
                  <Route path="/home" component={Home} />
                  <Route path="/material" component={Material} />
                  <Route path="/transaction" component={Transaction} />
                  <Route path="/other" component={Other} />
                  <Redirect from="/" to="/home" />
                </Switch>
              </Route>
            </Grid.Column>
            <Grid.Column width={1} />
          </Grid>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

export default App;
