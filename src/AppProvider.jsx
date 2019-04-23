import React, { Component } from "react";
import { Loading, Toast, DeleteAlert } from "./_helper/CostumToast";
import api from "./_helper/api";
import _ from "lodash";

export const AppContext = React.createContext();

class AppProvider extends Component {
  state = {
    materials: [],
    statusQCs: [],
    locationmaps: [],
    locations: [],
    stoks: [],
    getAPI: url => {
      // const state = url + "s";
      Loading.fire();
      const prom = [];
      url.forEach((x, i) => {
        prom[i] = api.get(x);
      });
      Promise.all(prom)
        .then(data => {
          const d = {};
          data.forEach((x, i) => {
            d[url[i] + "s"] = x.data;
          });
          this.setState(d);
          console.log("get call success :", url);
          Loading.close();
        })
        .catch(({ response }) => {
          if (response) {
            console.error("GET ERROR", response);
            if (response.status >= 400) {
              Loading.close();
              Toast("Server error", "error").fire();
            }
          } else {
            Loading.close();
            Toast("Server not Available", "error", false).fire();
          }
        });
    },
    postAPI: (url, postdata, success, error) => {
      const state = url + "s";
      api
        .post(url, postdata)
        .then(({ status, data }) => {
          if (status === 201) {
            const x = [data, ...this.state[state]];
            this.setState({ [state]: x });
            success(data);
            Loading.close();
            Toast("Item succesfully added!").fire();
          }
        })
        .catch(({ response }) => {
          if (response) {
            console.error("POST ERROR", response);
            if (response.status >= 400) {
              Loading.close();
              error(response);
            } else if (response.status >= 500) {
              Loading.close();
              Toast("Server Error!", "error").fire();
            }
          }
        });
    },
    putAPI: (url, id, postdata, success, error) => {
      const state = url + "s";
      api
        .put(`${url}/${id}`, postdata)
        .then(({ status }) => {
          if (status === 204) {
            const m = this.state[state].filter(x => x.id !== postdata.id);
            this.setState({ [state]: [postdata, ...m] });
            success();
            Toast("Item successfully edited!").fire();
          }
        })
        .catch(errors => {
          if (errors.response) {
            console.error("PUT ERROR", errors.response);
            if (errors.response.status === 400) {
              error(errors.response);
            } else if (errors.response.status >= 500) {
              Toast("Server Error!", "error").fire();
            }
          }
        });
    },
    handleDelete: (url, data) => {
      const state = url + "s";
      DeleteAlert.fire().then(result => {
        if (result.value) {
          api
            .delete(`${url}/${data.id}`)
            .then(({ status }) => {
              if (status === 200) {
                const filtered = this.state[state].filter(x => x !== data);
                this.setState({ [state]: filtered });
                Toast("Successfully delete item!").fire();
              } else {
                Toast("Delete failed", "error").fire();
              }
            })
            .catch(errors => {
              console.log("DELETE ERROR", errors);
            });
        }
      });
    },
    handleUpdate: (target, data) => {
      const m = this.state[target].filter(x => x.id !== data.id);
      this.setState({ [target]: _.orderBy([data, ...m], "id", "asc") });
    }
  };

  componentDidMount() {
    console.info("App Provider DidMounted");
    this.state.getAPI(["material", "statusQC", "locationmap", "stok"]);
  }

  render() {
    console.log("AppProvider Render");

    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppProvider;
