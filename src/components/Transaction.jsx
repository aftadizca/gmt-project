import React, { Component } from "react";
import { Tab } from "semantic-ui-react";
import MyTable from "./../_common/Table";

class Transaction extends Component {
  state = {};

  render() {
    const panes = [
      {
        menuItem: "MATERIAL STOCK",
        render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane>
      },
      {
        menuItem: "INCOMING",
        render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane>
      },
      {
        menuItem: "OUTCOMING",
        render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane>
      }
    ];

    return <Tab menu={{ pointing: true }} panes={panes} />;
  }
}

export default Transaction;
