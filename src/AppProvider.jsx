import React, { Component } from "react";
import { Loading, Toast, DeleteAlert } from "./_helper/CostumToast";
import api from "./_helper/api";
import _ from "lodash";
import { filterWithArray } from "./_helper/tool";

export const AppContext = React.createContext();

class AppProvider extends Component {
  state = {
    materials: [],
    statusQCs: [],
    locationmaps: [],
    locations: [],
    stoks: [],
    getAPI: (url, success) => {
      Loading.fire();
      const prom = [];
      url.forEach((x, i) => {
        prom[i] = api.get(x);
      });
      Promise.all(prom).then(data => {
        const d = {};
        data.forEach((x, i) => {
          d[url[i] + "s"] = x.data;
        });
        this.setState(d, () => success && success());
        Loading.close();
      });
    },
    postAPI: (url, postdata, success, error) => {
      Loading.fire();
      const state = url + "s";
      api
        .post(url, postdata)
        .then(({ status, data }) => {
          if (status === 201) {
            const x = [data, ...this.state[state]];
            this.setState({ [state]: x });
            Loading.close();
            success(data);
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
      Loading.fire();
      console.log("putAPI", { url, id, postdata, success, error });
      const state = url + "s";
      api
        .put(`${url}${id ? "/" + id : ""}`, postdata)
        .then(({ status }) => {
          if (status === 204) {
            if (id) {
              const m = this.state[state].filter(x => x.id !== postdata.id);
              this.setState({
                [state]: _.orderBy([postdata, ...m], "id", "asc")
              });
            } else {
              const m = filterWithArray(this.state[state], postdata, "id");
              this.setState({
                [state]: _.orderBy([...postdata, ...m], "id", "asc")
              });
            }

            Loading.close();
            success();
            Toast("Item successfully edited!").fire();
          }
        })
        .catch(errors => {
          if (errors.response) {
            console.error("PUT ERROR", errors.response);
            if (errors.response.status >= 400) {
              Loading.close();
              error(errors.response);
            } else if (errors.response.status >= 500) {
              Loading.close();
              Toast("Server Error!", "error").fire();
            }
          }
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
              if (status === 200) {
                const filtered = filterWithArray(this.state[state], data);
                this.setState(
                  { [state]: filtered },
                  () => success && success()
                );
                Loading.close();
                Toast("Successfully delete item!").fire();
              }
            })
            .catch(errors => {
              Loading.close();
              error(errors);
              Toast("Delete failed", "error").fire();
            });
        }
      });
    },
    locationMap: () => {
      const stok = this.state.stoks.filter(x => x.locationID !== 0);
      const locationmaps = this.state.locations.map(x => {
        const traceID = _.find(stok, ["locationID", x.id]);
        if (traceID) {
          const materialName = _.find(this.state.materials, [
            "id",
            traceID.materialID
          ]);
          return { ...x, traceID: traceID.id, materialName: materialName.name };
        } else {
          return { ...x, traceID: "", materialName: "" };
        }
      });

      this.setState({ locationmaps: _.orderBy(locationmaps, "name", "asc") });
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
