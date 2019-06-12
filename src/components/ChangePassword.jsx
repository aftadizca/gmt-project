import React, { Component } from "react";
import { Grid, Segment, Button, Input, Form, Message } from "semantic-ui-react";
import { AppContext } from "../AppProvider";
import api from "../_helper/api";
import { Toast } from "../_helper/CostumToast";

class ChangePassword extends Component {
  static contextType = AppContext;
  state = {
    cpassword: "",
    npassword: "",
    rnpassword: "",
    error: ""
  };

  handleOnChange = (e, data) => {
    this.setState({ [data.name]: data.value });
  };

  handleLogin = () => {
    const { cpassword, npassword, rnpassword } = this.state;
    if (cpassword === "" || npassword === "" || rnpassword === "") {
      this.setState({ error: "Field can't be empty" });
    } else if (npassword !== rnpassword) {
      this.setState({ error: "Repeat password not same" });
    } else {
      api
        .post("account/changepassword", {
          ...this.state,
          username: localStorage.getItem("name")
        })
        .then(response => {
          Toast("password has been changed");
        })
        .catch(ex => {
          if (ex.response) {
            this.setState({ error: ex.response.data });
          } else {
            Toast("Server not available", "error");
          }
        });
    }
  };

  render() {
    const { error } = this.state;
    return (
      <Grid columns="equal" padded="vertically">
        <Grid.Column stretched />
        <Grid.Column width="6">
          <Form error={error !== ""} onSubmit={this.handleLogin}>
            <Segment.Group stacked raised>
              <Segment padded="very">
                <Message
                  icon="warning circle"
                  error
                  header="ERROR"
                  content={error}
                />
                <Input
                  fluid
                  name="cpassword"
                  type="password"
                  icon="key"
                  iconPosition="left"
                  placeholder="CURRENT PASSWORD"
                  onChange={this.handleOnChange}
                />
                <br />
                <Input
                  fluid
                  name="npassword"
                  type="password"
                  icon="key"
                  iconPosition="left"
                  placeholder="NEW PASSWORD"
                  onChange={this.handleOnChange}
                />
                <br />
                <Input
                  fluid
                  name="rnpassword"
                  type="password"
                  icon="key"
                  iconPosition="left"
                  placeholder="REPEAT NEW PASSWORD"
                  onChange={this.handleOnChange}
                />
              </Segment>
              <Segment>
                <Button type="submit" color="blue">
                  SAVE
                </Button>
              </Segment>
            </Segment.Group>
          </Form>
        </Grid.Column>
        <Grid.Column stretched />
      </Grid>
    );
  }
}

export default ChangePassword;
