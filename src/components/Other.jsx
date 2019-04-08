import React, { Component } from "react";
import { Tab } from "semantic-ui-react";

class Other extends Component {
  state = {};
  render() {
    const panes = [
      {
        menuItem: "STATUS",
        render: () => <Tab.Pane attached={false}>Tab 1 Content</Tab.Pane>
      },
      {
        menuItem: "LOCATION",
        render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane>
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
