import React, { Component } from "react";
import { Loading, Toast } from "./_helper/CostumToast";
import api from "./_helper/api";

export const AppContext = React.createContext();

class AppProvider extends Component {
  state = {
    materials: [],
    getAPI: (url, state) => {
      Loading.fire();
      api
        .get(url)
        .then(({ data, headers }) => {
          console.log(headers.myheader);
          this.setState({ state: data });
          Loading.close();
        })
        .catch(({ response }) => {
          if (response) {
            if (response.status >= 400) {
              Loading.close();
              Toast("Server error", "error").fire();
            }
          } else {
            Loading.close();
            Toast("Server not Available", "error", false).fire();
          }
        });
    }
  };

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppProvider;
