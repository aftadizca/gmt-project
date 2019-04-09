import React, { Component } from "react";
import { Tab, Button, Icon, Popup } from "semantic-ui-react";
import MyTable from "./../_common/Table";
import Filtering from "./../_helper/filtering";

class Other extends Component {
  state = {
    statusQC: [
      { id: 1, total: 1250, name: "Unapprove" },
      { id: 2, total: 564, name: "Approve" },
      { id: 3, total: 564, name: "Quarantine" },
      { id: 4, total: 564, name: "Block" }
    ],
    tablePagination: { pageSize: 10, currentPage: 1 },
    searchValue: ""
  };

  handleDeleteStatusQC = id => {
    console.log(id);
  };

  handleOnSearch = () => {};

  handlePageChange = () => {};

  render() {
    const { statusQC, searchValue, tablePagination } = this.state;
    const statusQCHeader = ["STATUS ID", "STATUS", ""];
    const statusQCRow = ({ id, name }, i) => ({
      key: `row-${i}`,
      cells: [
        { key: id, content: id, width: 2 },
        { key: name, content: name },
        {
          key: i,
          width: 2,
          content: (
            <Button.Group basic size="small">
              <Popup
                inverted
                trigger={<Button icon="edit" />}
                content="Change me!!"
              />
              <Popup
                inverted
                trigger={
                  <Button
                    icon="trash"
                    onClick={() => this.handleDeleteStatusQC(id)}
                  />
                }
                content="Delete me!!"
              />
            </Button.Group>
          )
        }
      ]
    });

    const panes = [
      {
        menuItem: "STATUS QC",
        render: () => (
          <Tab.Pane attached={false}>
            <MyTable
              title="STATUS QC"
              headerRow={statusQCHeader}
              renderBodyRow={statusQCRow}
              data={Filtering(statusQC, searchValue)}
              onPageChange={this.handlePageChange}
              pagination={tablePagination}
              onSearch={this.handleOnSearch}
              button={
                <Button.Group>
                  <Button animated="vertical">
                    <Button.Content hidden>Add</Button.Content>
                    <Button.Content visible>
                      <Icon name="add" />
                    </Button.Content>
                  </Button>
                </Button.Group>
              }
            />
          </Tab.Pane>
        )
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
