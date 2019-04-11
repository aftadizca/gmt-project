import React, { Component } from "react";
import API from "../_helper/api";
import MyTable from "./../_common/Table";
import _ from "lodash";
import {
  Segment,
  Button,
  Icon,
  Popup,
  Modal,
  Form,
  Message
} from "semantic-ui-react";
import { DeleteAlert, Toast, Loading } from "../_helper/CostumToast";

class Material extends Component {
  state = {
    materials: [],
    addMaterial: { id: "", name: "", suplier: "", type: "", unit: "" },
    addMaterialError: false,
    addMaterialErrorMsg: "",
    addMaterialOpen: false
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
          Toast("Server not Available", "error", false).fire();
        } else if (response.status >= 400) {
          Loading.close();
          Toast("Server error", "error").fire();
        }
      });
  }

  handleDetail = movie => {
    console.log(movie);
  };

  handleDelete = data => {
    DeleteAlert.fire().then(result => {
      if (result.value) {
        API.delete("material/" + data.id)
          .then(({ status }) => {
            if (status === 200) {
              const filtered = this.state.materials.filter(x => x !== data);
              this.setState({ materials: filtered });
              Toast("Successfully delete item!").fire();
            } else {
              Toast("Delete failed", "error").fire();
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
    const { name, suplier, unit, type } = this.state.addMaterial;
    if (name && suplier && unit && type) {
      API.post("material", this.state.addMaterial)
        .then(({ status, data }) => {
          if (status === 201) {
            const materials = [data, ...this.state.materials];
            this.setState({ materials });
            this.handleAddMaterialClose();
            this.handleAddMaterialClear();
            Toast("Material added!").fire();
          }
        })
        .catch(error => {
          if (error.response) {
            if (error.response.status === 400) {
              this.setState({
                addMaterialError: true,
                addMaterialErrorMsg: error.response.data.error
              });
            } else if (error.response.status >= 500) {
              Toast("Server Error!", "error").fire();
            }
          }
        });
    } else {
      this.setState({
        addMaterialError: true,
        addMaterialErrorMsg: "Field Can't be Empty!"
      });
    }
    e.preventDefault();
  };

  handleAddMaterialOpen = () => {
    this.setState({ addMaterialOpen: true });
  };

  handleAddMaterialClose = () => {
    this.setState({ addMaterialOpen: false });
  };

  handleAddMaterialClear = () => {
    this.setState({
      addMaterial: { id: "", name: "", suplier: "", type: "", unit: "" }
    });
  };

  render() {
    const {
      materials,
      addMaterialError,
      addMaterial,
      addMaterialOpen,
      addMaterialErrorMsg
    } = this.state;
    const headerRow = ["MATERIAL ID", "MATERIAL NAME", "SUPLIER", "UNIT", ""];
    const renderBodyRow = (data, i) => ({
      key: `row-${i}`,
      cells: [
        data.id,
        data.name,
        data.suplier,
        data.unit,
        {
          key: i,
          width: 2,
          content: (
            <Button.Group basic size="small">
              <Popup
                inverted
                trigger={
                  <Button icon="edit" onClick={() => this.handleDetail(data)} />
                }
                content="Change me!!"
              />
              <Popup
                inverted
                trigger={
                  <Button
                    icon="trash"
                    onClick={() => this.handleDelete(data)}
                  />
                }
                content="Delete me!!"
              />
            </Button.Group>
          )
        }
      ]
    });

    const buttonAdd = (
      <Button animated="vertical" onClick={this.handleAddMaterialOpen}>
        <Button.Content hidden>Add</Button.Content>
        <Button.Content visible>
          <Icon name="add" />
        </Button.Content>
      </Button>
    );

    const AddMaterialModal = (
      <Modal
        closeOnDimmerClick={false}
        closeIcon
        button={buttonAdd}
        size="small"
        open={addMaterialOpen}
        onClose={this.handleAddMaterialClose}
      >
        <Modal.Header>ADD MATERIAL</Modal.Header>
        <Modal.Content>
          <Form error={addMaterialError}>
            <Message error header="ERROR" content={addMaterialErrorMsg} />
            <Form.Input
              label="Material Name"
              name="name"
              value={addMaterial.name}
              onChange={this.handleChangeMaterial}
              placeholder="Material Name"
            />
            <Form.Input
              label="Suplier"
              onChange={this.handleChangeMaterial}
              name="suplier"
              value={addMaterial.suplier}
              placeholder="Suplier"
            />
            <Form.Group widths="equal">
              <Form.Input
                fluid
                label="Type"
                onChange={this.handleChangeMaterial}
                name="type"
                value={addMaterial.type}
                placeholder="Type"
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
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="grey" onClick={this.handleAddMaterialClear}>
            CLEAR
          </Button>
          <Button color="blue" onClick={this.handleSubmitMaterial}>
            SAVE
          </Button>
        </Modal.Actions>
      </Modal>
    );

    return (
      <React.Fragment>
        {AddMaterialModal}
        <Segment raised piled>
          <MyTable
            title="MATERIAL"
            headerRow={headerRow}
            renderBodyRow={renderBodyRow}
            data={materials}
            button={<Button.Group>{buttonAdd}</Button.Group>}
          />
        </Segment>
      </React.Fragment>
    );
  }
}

export default Material;
