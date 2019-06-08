import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Material from "./components/Material";
import Transaction from "./components/Transaction";
import Other from "./components/Other";
import { Grid } from "semantic-ui-react";
import Print from "./components/Print";
import Login from "./components/Login";
import { AppContext } from "./AppProvider";
import Loader from "./components/Loader";
import background from "./bg.jpg";
import Logout from "./components/Logout";

class App extends Component {
  static contextType = AppContext;
  render() {
    const { login } = this.context;
    if (!this.context.login) {
      document.body.style.backgroundImage = `url(${background})`;
      document.body.style.backgroundSize = "cover";
    } else {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundSize = "";
    }
    return (
      <React.Fragment>
        <div style={{ marginTop: "3rem" }} />
        <BrowserRouter>
          {login && (
            <Route
              path={["/home", "/material", "/transaction", "/other"]}
              component={Loader}
            />
          )}
          <Grid>
            <Grid.Column width={1} />
            <Grid.Column width={14}>
              <Switch>
                {login && <Route path="/home" component={Home} />}
                {login && <Route path="/material" component={Material} />}
                {login && <Route path="/logout" component={Logout} />}
                {login && (
                  <Route name="print" path="/print" component={Print} />
                )}
                {login && (
                  <Route path="/transaction/:tab" component={Transaction} />
                )}
                {login && <Route path="/other/:tab" component={Other} />}
                {login && <Redirect from="/other" to="/other/statusqc" />}
                {login && (
                  <Redirect from="/transaction" to="/transaction/stok" />
                )}
                {login && <Redirect from="/" to="/home" />}
                {login && <Redirect from="/logout" to="/login" />}
                {login && <Redirect from="/login" to="/home" />}
                <Route path="/login" component={Login} />
                <Redirect from="/" to="/login" />
              </Switch>
            </Grid.Column>
            <Grid.Column width={1} />
          </Grid>
        </BrowserRouter>
        <div style={{ paddingTop: "3rem" }} />
      </React.Fragment>
    );
  }
}

export default App;
