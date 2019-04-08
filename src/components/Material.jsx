import React, { Component } from "react";
import API from "../_helper/api";
import MyTable from "./../_common/Table";
import { Segment, Button, Icon, Popup } from "semantic-ui-react";
import { DeleteAlert, Toast, Loading } from "../_helper/CostumToast";
import Filtering from "../_helper/filtering";

class Material extends Component {
  state = {
    materials: [],
    tablePagination: { pageSize: 10, currentPage: 1 },
    searchValue: ""
  };

  componentDidMount() {
    Loading.fire();
    API.get("material")
      .then(({ data }) => {
        this.setState({ materials: data });
        Loading.close();
      })
      .catch(({ response }) => {
        if (typeof response === "undefined") {
          Loading.close();
          Toast("error", "Server not Available", false).fire();
        } else if (response.status >= 400) {
          Loading.close();
          Toast("error", "Server error").fire();
        }
      });
  }

  handleButtonTableClick = movie => {
    console.log(movie);
  };

  handlePageChange = (e, a) => {
    let tablePagination = { ...this.state.tablePagination };
    tablePagination.currentPage = a.activePage;
    this.setState({ tablePagination });
  };

  handleOnSearch = e => {
    this.setState({ searchValue: e.currentTarget.value });
  };

  handleDelete = id => {
    DeleteAlert.fire().then(result => {
      if (result.value) {
        API.delete("material/" + btoa(id))
          .then(({ status }) => {
            if (status === 200) {
              const materials = [...this.state.materials];
              const filtered = materials.filter(x => x.id !== id);
              this.setState({ materials: filtered });
              Toast("success", "Successfully delete item!").fire();
            } else {
              Toast("error", "Delete failed").fire();
            }
          })
          .catch(errors => {
            console.log(errors);
          });
      }
    });
  };

  render() {
    const { materials, tablePagination } = this.state;
    const headerRow = ["MATERIAL ID", "MATERIAL NAME", "SUPLIER", "UNIT", ""];
    const renderBodyRow = ({ id, name, suplier, unit }, i) => ({
      key: `row-${i}`,
      cells: [
        id,
        name,
        suplier,
        unit,
        {
          key: i,
          width: 3,
          content: (
            <Button.Group>
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

    return (
      <Segment raised piled>
        <MyTable
          title="MATERIAL"
          headerRow={headerRow}
          renderBodyRow={renderBodyRow}
          data={Filtering(materials, this.state.searchValue)}
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
      </Segment>
    );
  }
}

export default Material;
