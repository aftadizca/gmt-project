import React, { Component } from "react";
import {
  Grid,
  Segment,
  Header,
  Button,
  Input,
  Form,
  Message,
  Image,
  Divider
} from "semantic-ui-react";
import { AppContext } from "../AppProvider";
import logo from "./../warehouse.svg";
import api from "../_helper/api";
import { Toast } from "./../_helper/CostumToast";

class Login extends Component {
  static contextType = AppContext;
  state = {
    username: "",
    password: "",
    error: ""
  };

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

  handleOnChange = (e, data) => {
    this.setState({ [data.name]: data.value });
  };

  handleLogin = () => {
    const { username, password } = this.state;
    if (username === "" && password === "") {
      this.setState({ error: "Username & Password required!!" });
    } else if (username === "") {
      this.setState({ error: "Username required!!" });
    } else if (password === "") {
      this.setState({ error: "Password required!!" });
    } else {
      api
        .post("account/login", { ...this.state })
        .then(response => {
          this.context.setLogin(true);
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
    const { username, error } = this.state;
    return (
      <Grid columns="equal" padded="vertically">
        <Grid.Column stretched />
        <Grid.Column width="6">
          <Form error={error !== ""} onSubmit={this.handleLogin}>
            <Segment.Group stacked raised>
              <Segment color="blue" inverted padded>
                <Header textAlign="center">
                  <Image src={logo} className="login-img" />
                  <Divider hidden fitted />
                  <Header.Content as="h2">GUDANG MATERIAL</Header.Content>
                </Header>
              </Segment>
              <Segment padded="very">
                <Message
                  icon="warning circle"
                  error
                  header="ERROR"
                  content={error}
                />
                <Input
                  fluid
                  name="username"
                  icon="user"
                  iconPosition="left"
                  placeholder="USERNAME"
                  onChange={this.handleOnChange}
                  value={username}
                />
                <br />
                <Input
                  fluid
                  name="password"
                  type="password"
                  icon="key"
                  iconPosition="left"
                  placeholder="PASSWORD"
                  onChange={this.handleOnChange}
                />
              </Segment>
              <Segment>
                <Button type="submit" color="blue">
                  LOGIN
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

export default Login;
