import React, { Component } from "react";
import { Tab, Button, Icon } from "semantic-ui-react";
import MyTable from "./../_common/Table";
import Filtering from "./../_helper/filtering";

class Other extends Component {
  state = {
    statusQC: [
      { id: 1, name: "Unapprove" },
      { id: 2, name: "Approve" },
      { id: 3, name: "Quarantine" },
      { id: 4, name: "Block" }
    ],
    tablePagination: { pageSize: 10, currentPage: 1 },
    searchValue: ""
  };

  handleDelete = () => {};

  handleOnSearch = () => {};

  handlePageChange = () => {};

  render() {
    const { statusQC, searchValue, tablePagination } = this.state;
    const headerRow = ["STATUS ID", "STATUS", ""];
    const renderBodyRow = ({ id, name }, i) => ({
      key: `row-${i}`,
      cells: [
        { key: id, content: id, width: 2 },
        { key: name, content: name },
        {
          key: i,
          width: 2,
          content: (
            <Button.Group floated="right">
              <Button animated="vertical" size="mini">
                <Button.Content hidden>Edit</Button.Content>
                <Button.Content visible>
                  <Icon name="edit" />
                </Button.Content>
              </Button>
              <Button animated="vertical" onClick={() => this.handleDelete(id)}>
                <Button.Content hidden>Delete</Button.Content>
                <Button.Content visible>
                  <Icon name="delete" />
                </Button.Content>
              </Button>
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
              headerRow={headerRow}
              renderBodyRow={renderBodyRow}
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
