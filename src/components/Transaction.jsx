import React, { Component } from "react";
import { Tab, Icon } from "semantic-ui-react";
import MyTable from "./../_common/Table";
import { TITLE } from "../_helper/constant";

class Transaction extends Component {
  state = {
    materialStocks: [],
    incomings: [],
    outcomings: []
  };

  render() {
    document.title = "TRANSACTION - " + TITLE;

    const materialStockHeader = [
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

    const panes = [
      {
        menuItem: {
          key: "MATERIAL STOCK",
          content: "MATERIAL STOCK",
          icon: <Icon name="warehouse" size="large" />
        },
        render: () => (
          <Tab.Pane attached={false} raised piled>
            Tab 1 Content
          </Tab.Pane>
        )
      },
      {
        menuItem: {
          key: "INCOMING",
          content: "INCOMING",
          icon: <Icon name="arrow circle down" size="large" />
        },
        render: () => (
          <Tab.Pane attached={false} raised piled>
            Tab 2 Content
          </Tab.Pane>
        )
      },
      {
        menuItem: {
          key: "OUTCOMING",
          content: "OUTCOMING",
          icon: <Icon name="arrow circle up" size="large" />
        },
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

export default Transaction;
