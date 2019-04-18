import React, { Component } from "react";
import { Tab, Icon } from "semantic-ui-react";
import MyTable from "./../_common/Table";
import { TITLE } from "../_helper/constant";
import { AppContext } from "../AppProvider";

class Other extends Component {
  state = {};

  static contextType = AppContext;

  componentDidMount() {
    this.context.getAPI("location");
    this.context.getAPI("statusQC");
  }

  handleDeleteStatusQC = id => {
    console.log(id);
  };

  render() {
    document.title = "OTHER - " + TITLE;
    const { statusQCs, locations } = this.context;

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
          content: traceID || <Icon name="question" />,
          className: traceID || "error"
        },
        {
          key: "materialName" + i,
          content: materialName || <Icon name="question" />,
          className: materialName || "error"
        }
      ]
    });

    const panes = [
      {
        menuItem: {
          key: "STATUS QC",
          content: "STATUS QC",
          icon: <Icon size="large" name="clipboard check" />
        },
        render: () => (
          <Tab.Pane attached={false} raised piled>
            <MyTable
              key={1}
              title="STATUS QC"
              headerRow={statusQCHeader}
              renderBodyRow={statusQCRow}
              data={statusQCs}
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
          icon: <Icon size="large" name="map marker alternate" />
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
