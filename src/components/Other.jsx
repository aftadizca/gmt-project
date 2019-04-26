import React, { Component } from "react";
import { Tab, Icon, Menu, Button } from "semantic-ui-react";
import MyTable from "./../_common/MyTable";
import { TITLE } from "../_helper/constant";
import { AppContext } from "../AppProvider";
import { NavLink } from "react-router-dom";
import TableButton from "../_common/TableButton";

class Other extends Component {
  static contextType = AppContext;
  state = {
    locationMap: []
  };

  componentDidMount() {
    console.log("Other DidMounted");
  }

  handleDeleteStatusQC = id => {
    console.log(id);
  };

  render() {
    document.title = this.props.match.params.tab.toUpperCase() + " - " + TITLE;
    const { statusQCs, locationmaps } = this.context;

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

    //indexing tab
    const TabIndex = {
      statusqc: 0,
      locationmap: 1
    };

    const panes = [
      {
        menuItem: (
          <Menu.Item
            key="statusqc"
            className="tabmenu"
            as={NavLink}
            to="/other/statusqc"
          >
            <Icon name="clipboard check" /> STATUS QC
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane attached={false} raised piled>
            <MyTable
              key={1}
              title="STATUS QC"
              header={statusQCHeader}
              body={statusQCRow}
              data={statusQCs}
              orderBy={0}
              button={
                <Button.Group>
                  <TableButton
                    title="Refresh"
                    icon="refresh"
                    onClick={() => this.context.getAPI(["statusqc"])}
                  />
                </Button.Group>
              }
            />
          </Tab.Pane>
        )
      },
      {
        menuItem: (
          <Menu.Item
            key="location"
            className="tabmenu"
            as={NavLink}
            to="/other/locationmap"
          >
            <Icon name="map marker alternate" /> LOCATION MAP
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane attached={false} raised piled>
            <MyTable
              key={2}
              title="LOCATION"
              header={locationHeader}
              body={locationRow}
              data={locationmaps}
              orderBy={0}
              searchBar
              button={
                <Button.Group>
                  <TableButton
                    title="Refresh"
                    icon="refresh"
                    onClick={() => this.context.getAPI(["locationmap"])}
                  />
                </Button.Group>
              }
            />
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
        activeIndex={TabIndex[this.props.match.params.tab]}
        panes={panes}
      />
    );
  }
}

export default Other;
