import React, { Component } from "react";
import { Tab } from "semantic-ui-react";
import MyTable from "./../_common/Table";
import api from "../_helper/api";
import { Loading, Toast } from "../_helper/CostumToast";
import { axios } from "axios";

class Other extends Component {
  state = {
    statusQC: [],
    locations: []
  };

  componentDidMount() {
    Loading.fire();
    Promise.all([api.get("statusqc"), api.get("location")])
      .then(result => {
        this.setState({ statusQC: result[0].data });
        this.setState({ locations: result[1].data });
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

  handleDeleteStatusQC = id => {
    console.log(id);
  };

  render() {
    const { statusQC, locations } = this.state;
    const statusQCHeader = [
      { key: 1, content: "STATUS ID", name: "id" },
      { key: 2, content: "STATUS", name: "name" }
    ];
    const statusQCRow = ({ id, name }, i) => ({
      key: `row-${i}`,
      cells: [
        { key: `td-${i}`, content: id, width: 2 },
        { key: name, content: name }
      ]
    });

    const locationHeader = [
      { key: 1, content: "LOCATION", name: "location" },
      { key: 2, content: "TRACE", name: "traceID" },
      { key: 3, content: "MATERIAL NAME", name: "materialName" }
    ];
    const locationRow = ({ location, materialName, traceID }, i) => ({
      key: `row-${i}`,
      cells: [
        { key: location, content: location, width: 2 },
        {
          key: "traceID" + i,
          content: traceID || "NONE",
          className: traceID || "error"
        },
        {
          key: "materialName" + 1,
          content: materialName || "NONE",
          className: materialName || "error"
        }
      ]
    });

    const panes = [
      {
        menuItem: "STATUS QC",
        render: () => (
          <Tab.Pane attached={false}>
            <MyTable
              key={1}
              title="STATUS QC"
              headerRow={statusQCHeader}
              renderBodyRow={statusQCRow}
              data={statusQC}
              orderBy="id"
              orderDirection="asc"
            />
          </Tab.Pane>
        )
      },
      {
        menuItem: "LOCATION",
        render: () => (
          <Tab.Pane attached={false}>
            <MyTable
              key={2}
              title="LOCATION"
              headerRow={locationHeader}
              renderBodyRow={locationRow}
              data={locations}
              orderBy="location"
              actionBar={true}
              orderDirection="asc"
            />
          </Tab.Pane>
        )
      },
      {
        menuItem: "Tab 3",
        render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane>
      }
    ];

    return <Tab menu={{ pointing: true }} panes={panes} />;
  }
}

export default Other;
