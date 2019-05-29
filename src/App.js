import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import MySideBar from "./components/Sidebar";
import Home from "./components/Home";
import Material from "./components/Material";
import Transaction from "./components/Transaction";
import Other from "./components/Other";
import { Grid } from "semantic-ui-react";
import Print from "./components/Print";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <div style={{ marginTop: "3rem" }} />
        <BrowserRouter>
          <Route>
            <MySideBar />
            <Grid>
              <Grid.Column width={1} />
              <Grid.Column width={14}>
                <Switch>
                  <Route path="/home" component={Home} />
                  <Route path="/material" component={Material} />
                  <Route name="print" path="/print" component={Print} />
                  <Route path="/transaction/:tab" component={Transaction} />
                  <Route path="/other/:tab" component={Other} />
                  <Redirect from="/other" to="/other/statusqc" />
                  <Redirect from="/transaction" to="/transaction/stok" />
                  <Redirect from="/" to="/home" />
                </Switch>
              </Grid.Column>
              <Grid.Column width={1} />
            </Grid>
          </Route>
        </BrowserRouter>
        <div style={{ paddingTop: "3rem" }} />
      </React.Fragment>
    );
  }
}

export default App;
