import React, { Component } from "react";
import { Tab } from "semantic-ui-react";
import MyTable from "./../_common/Table";
import api from "../_helper/api";
import { Loading, Toast } from "../_helper/CostumToast";
import { TITLE } from "../_helper/constant";

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
    document.title = "OTHER - " + TITLE;
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
        { key: location, content: location, width: 4 },
        {
          key: "traceID" + i,
          content: traceID,
          className: traceID || "error"
        },
        {
          key: "materialName" + i,
          content: materialName,
          className: materialName || "error"
        }
      ]
    });

    const panes = [
      {
        menuItem: {
          key: "STATUS QC",
          content: "STATUS QC",
          icon: "clipboard check large"
        },
        render: () => (
          <Tab.Pane attached={false} raised piled>
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
        menuItem: {
          key: "LOCATION",
          content: "LOCATION",
          icon: "map marker alternate large"
        },
        render: () => (
          <Tab.Pane attached={false} raised piled>
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
        render: () => (
          <Tab.Pane attached={false} raised piled>
            Tab 3 Content
          </Tab.Pane>
        )
      }
    ];

    return (
      <Tab
        menu={{
          borderless: true,
          color: "blue",
          pointing: true,
          inverted: true
        }}
        panes={panes}
      />
    );
  }
}

export default Other;
