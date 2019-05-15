import React, { Component } from "react";
import { Loading, Toast, DeleteAlert } from "./_helper/CostumToast";
import api from "./_helper/api";
import _ from "lodash";
import { DB } from "./_helper/constant";

export const AppContext = React.createContext();

class AppProvider extends Component {
  handleApiError = (err, errCall) => {
    if (err.response) {
      switch (err.response.status) {
        case 400:
        case 401:
        case 404:
          Loading.close();
          if (errCall) {
            errCall(err.response);
          } else {
            Toast(err.response.data, "error").fire();
          }
          break;
        default:
          Loading.close();
          Toast("Server error !!", "error").fire();
          break;
      }
    } else {
      Loading.close();
      Toast("Network error !!", "error").fire();
    }
  };

  state = {
    [DB.materials]: [],
    [DB.statusQCs]: [],
    [DB.locationmaps]: [],
    [DB.locations]: [],
    [DB.stoks]: [],
    getAPI: (url, success) => {
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
          success && success();
          Loading.close();
        })
        .catch(err => {
          this.handleApiError(err);
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
            if (typeof data === "object") {
              x = [...data, ...this.state[state]];
            } else {
              x = [data, ...this.state[state]];
            }
            this.setState({ [state]: x });
            Loading.close();
            success(data);
            Toast("Item succesfully added!").fire();
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
          if (status === 200) {
            if (!Array.isArray(data)) {
              const m = this.state[state].filter(x => x.id !== data.id);
              this.setState({
                [state]: _.orderBy([data, ...m], "id", "asc")
              });
            } else {
              const filtered = _.differenceBy(this.state[state], data, "id");
              this.setState({
                [state]: _.orderBy([...data, ...filtered], "id", "asc")
              });
            }
          }
          Loading.close();
          success && success();
          Toast("Item successfully edited!").fire();
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
                  [state]: _.orderBy([...data, ...filtered], "id", "asc")
                });
                success && success();
                Loading.close();
                Toast("Successfully delete item!").fire();
              }
            })
            .catch(err => {
              this.handleApiError(err, error);
            });
        }
      });
    },
    locationMap: () => {
      const stok = this.state.stoks.filter(x => x.locationID !== 0);
      const locationmaps = this.state.locations.map(x => {
        const traceID = _.find(stok, ["locationID", x.id]);
        if (traceID) {
          const materialName = this.state[DB.materials].find(
            x => x.id === traceID.materialID
          );
          return { ...x, traceID: traceID.id, materialName: materialName.name };
        } else {
          return { ...x, traceID: "", materialName: "" };
        }
      });

      this.setState({ locationmaps: _.orderBy(locationmaps, "name", "asc") });
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
    }
  };

  componentDidMount() {
    this.state.getAPI(["material", "statusQC", "location", "stok"], () =>
      this.state.locationMap()
    );
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
