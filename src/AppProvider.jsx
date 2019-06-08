import React, { Component } from "react";
import { Loading, Toast, DeleteAlert } from "./_helper/CostumToast";
import api from "./_helper/api";
import _ from "lodash";
import { DB } from "./_helper/constant";

export const AppContext = React.createContext();

class AppProvider extends Component {
  handleApiError = (err, errCall, repeatFunc) => {
    if (err.response) {
      switch (err.response.status) {
        case 400:
        case 401:
        case 404:
          Loading.clickConfirm();
          if (errCall) {
            errCall(err.response);
          } else {
            Toast(err.response.data, "error");
          }
          break;
        default:
          Loading.clickConfirm();
          Toast("Server error !!", "error");
          break;
      }
    } else {
      if (this.timer) {
      } else {
        Loading.clickConfirm();
        this.timer = setInterval(() => {
          repeatFunc();
        }, 2000);
        Toast("Network error !!", "error", false);
      }
    }
  };

  timer = false;

  state = {
    login: false,
    [DB.materials]: [],
    [DB.statusQCs]: [],
    [DB.locationmaps]: [],
    [DB.locations]: [],
    [DB.stoks]: [],
    [DB.graphs]: [],
    [DB.materialouts]: [],
    getAPI: (url, success) => {
      !this.timer && Loading.fire();
      const prom = [];
      url.forEach((x, i) => {
        prom[i] = api.get(x);
      });
      Promise.all(prom)
        .then(data => {
          clearInterval(this.timer);
          this.timer = false;
          Loading.clickConfirm();
          const d = {};
          data.forEach((x, i) => {
            d[url[i] + "s"] = x.data;
          });
          this.setState(d);
          success && success();
        })
        .catch(err => {
          this.handleApiError(err, undefined, () =>
            this.state.getAPI(url, success)
          );
        });
    },
    postAPI: (url, postdata, success, error) => {
      Loading.fire();
      const state = url + "s";
      api
        .post(url, postdata)
        .then(({ status, data }) => {
          if (status === 201) {
            let x = [];
            if (Array.isArray(data)) {
              x = _.sortBy([...data, ...this.state[state]], "id");
            } else {
              x = _.sortBy([data, ...this.state[state]], "id");
            }
            this.setState({ [state]: x });
            Loading.clickConfirm();
            success(data);
            Toast("Item succesfully added!");
          }
        })
        .catch(err => {
          this.handleApiError(err, error);
        });
    },
    putAPI: (url, postdata, success, error) => {
      Loading.fire();
      console.log("putAPI", {
        url,
        postdata,
        success,
        error
      });
      const state = url + "s";
      api
        .put(`${url}`, postdata)
        .then(({ status, data }) => {
          console.log("is array", Array.isArray(data));
          if (status === 200 || status === 201) {
            if (!Array.isArray(data)) {
              const m = this.state[state].filter(x => x.id !== data.id);
              this.setState({
                [state]: _.sortBy([data, ...m], "id")
              });
            } else {
              const filtered = _.differenceBy(this.state[state], data, "id");
              this.setState({
                [state]: _.sortBy([...data, ...filtered], "id")
              });
            }
          }
          Loading.clickConfirm();
          success && success();
        })
        .catch(err => {
          console.error("PUT ERROR", err.response);
          this.handleApiError(err, error);
        });
    },
    deleteAPI: (url, data, success, error) => {
      Loading.fire();
      const state = url + "s";
      DeleteAlert.fire().then(result => {
        if (result.value) {
          api
            .delete(`${url}`, { data: data })
            .then(({ status }) => {
              if (status === 204) {
                const filtered = _.differenceBy(this.state[state], data, "id");
                this.setState({
                  [state]: _.sortBy([...data, ...filtered], "id")
                });
                success && success();
                Loading.clickConfirm();
                Toast("Successfully delete item!");
              }
            })
            .catch(err => {
              this.handleApiError(err, error);
            });
        }
      });
    },
    locationMap: async () => {
      return await new Promise(resolve => {
        setTimeout(() => {
          const filteredStok = stok.filter(x => x.isOut === false);
          const locationmaps = this.state.locations.map(x => {
            const traceID = _.find(filteredStok, ["locationID", x.id]);
            if (traceID) {
              const materialName = this.state[DB.materials].find(
                x => x.id === traceID.materialID
              );
              return {
                ...x,
                traceID: traceID.id,
                materialName: materialName.name
              };
            } else {
              return { ...x, traceID: "", materialName: "" };
            }
          });
          resolve(locationmaps);
        }, 1000);
        const stok = this.state.stoks.filter(x => x.locationID !== 0);
      }).then(locationmaps => {
        this.setState({ locationmaps: _.orderBy(locationmaps, "name", "asc") });
      });
    },
    useRelation: (db, key, value) => {
      try {
        let found = this.state[db].find(x => {
          return x.id === key;
        });
        return found[value];
      } catch (error) {
        return false;
      }
    },
    loadResource: () => {
      console.log("sdsdsd");
      this.state.getAPI(
        ["stok", "statusQC", "location", "material", "graph", "materialout"],
        () => this.state.locationMap()
      );
    },
    setLogin: b => {
      this.setState({ login: b });
    },
    auth: () => {
      api
        .get("account")
        .then(response => {
          if (response.status === 200) this.state.setLogin(true);
        })
        .catch(errors => {
          this.state.setLogin(false);
        });
    }
  };

  componentDidMount() {
    this.state.auth();
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppProvider;
