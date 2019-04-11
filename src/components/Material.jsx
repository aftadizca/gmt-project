import React, { Component } from "react";
import API from "../_helper/api";
import MyTable from "./../_common/Table";
import Cleave from "cleave.js/react";
import _ from "lodash";
import {
  Segment,
  Button,
  Icon,
  Popup,
  Modal,
  Form,
  Label,
  Message
} from "semantic-ui-react";
import { DeleteAlert, Toast, Loading } from "../_helper/CostumToast";
import Filtering from "../_helper/filtering";

class Material extends Component {
  state = {
    materials: [],
    tablePagination: { pageSize: 10, currentPage: 1 },
    searchValue: "",
    addMaterial: { id: "", name: "", suplier: "", unit: "" },
    addMaterialError: { submit: true, error: false, msg: "" }
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
  handleChangeMaterial = (e, { name }) => {
    this.setState({
      addMaterial: { ...this.state.addMaterial, [name]: e.target.value }
    });
  };
  handleSubmitMaterial = e => {
    const { id, name, suplier, unit } = this.state.addMaterial;
    if (id && name && suplier && unit) {
      console.log("submited");
    }
    e.preventDefault();
  };

  render() {
    const {
      materials,
      tablePagination,
      addMaterialError,
      addMaterial
    } = this.state;
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
                  <Button icon="trash" onClick={() => this.handleDelete(id)} />
                }
                content="Delete me!!"
              />
            </Button.Group>
          )
        }
      ]
    });

    const buttonAdd = (
      <Modal
        closeIcon
        size="small"
        trigger={
          <Button animated="vertical">
            <Button.Content hidden>Add</Button.Content>
            <Button.Content visible>
              <Icon name="add" />
            </Button.Content>
          </Button>
        }
      >
        <Modal.Header>ADD MATERIAL</Modal.Header>
        <Modal.Content>
          <Form
            error={addMaterialError.error}
            onSubmit={this.handleSubmitMaterial}
          >
            <Message error header="Warning" content={addMaterialError.msg} />
            <Cleave
              placeholder="GMT/02/01/1"
              options={{
                delimiter: "/",
                blocks: [3, 2, 2, 1000],
                uppercase: true
              }}
            />
            <Form.Input
              as={Cleave}
              label="Material ID"
              onChange={this.handleChangeMaterial}
              value={addMaterial.id}
              placeholder="Material ID"
              options={{
                delimiter: "/",
                blocks: [3, 2, 2, 1000000],
                uppercase: true
              }}
            />

            <Form.Input
              label="Material Name"
              name="name"
              value={addMaterial.name}
              onChange={this.handleChangeMaterial}
              placeholder="Material Name"
            />
            <Form.Group widths="equal">
              <Form.Input
                fluid
                label="Suplier"
                onChange={this.handleChangeMaterial}
                name="suplier"
                value={addMaterial.suplier}
                placeholder="Suplier"
              />
              <Form.Input
                fluid
                label="Unit"
                onChange={this.handleChangeMaterial}
                name="unit"
                value={addMaterial.unit}
                placeholder="Unit"
              />
            </Form.Group>

            <Form.Button>SAVE</Form.Button>
          </Form>
        </Modal.Content>
      </Modal>
    );

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
          button={<Button.Group>{buttonAdd}</Button.Group>}
        />
      </Segment>
    );
  }
}

export default Material;
