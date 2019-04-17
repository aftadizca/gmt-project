import React, { Component } from "react";
import API from "../_helper/api";
import MyTable from "./../_common/Table";
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
import { UnitList } from "../_helper/SelectList";
import { TypeList } from "./../_helper/SelectList";

class Material extends Component {
  state = {
    materials: [],
    addMaterial: { id: "", name: "", suplier: "", type: "", unit: "" },
    addMaterialError: false,
    addMaterialErrorMsg: "",
    addMaterialOpen: false,
    editMaterial: { id: "", name: "", suplier: "", type: "", unit: "" },
    editMaterialError: false,
    editMaterialErrorMsg: "",
    editMaterialOpen: false
  };

  componentDidMount() {
    Loading.fire();
    API.get("material")
      .then(({ data, headers }) => {
        console.log(headers.myheader);
        this.setState({ materials: data });
        Loading.close();
      })
      .catch(({ response }) => {
        if (response) {
          if (response.status >= 400) {
            Loading.close();
            Toast("Server error", "error").fire();
          }
        } else {
          Loading.close();
          Toast("Server not Available", "error", false).fire();
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

  //#region ADD MATERIAL ACTION
  handleChangeAddMaterial = (e, { name, value }) => {
    this.setState({
      addMaterial: { ...this.state.addMaterial, [name]: value.toUpperCase() }
    });
  };

  handleSaveAddMaterial = e => {
    Loading.fire();
    const { name, suplier, unit, type } = this.state.addMaterial;
    if (name && suplier && unit && type) {
      API.post("material", this.state.addMaterial)
        .then(({ status, data }) => {
          if (status === 201) {
            const materials = [data, ...this.state.materials];
            this.setState({ materials });
            this.handleAddMaterialClose();
            this.handleAddMaterialClear();
            Loading.close();
            Toast("Material added!").fire();
          }
        })
        .catch(({ response }) => {
          if (response) {
            if (response.status >= 400) {
              Loading.close();
              this.setState({
                addMaterialError: true,
                addMaterialErrorMsg: response.data.error
              });
            } else if (response.status >= 500) {
              Loading.close();
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
      addMaterial: { id: "", name: "", suplier: "", type: "", unit: "" },
      addMaterialError: false
    });
  };
  //#endregion

  //#region EDIT MATERIAL ACTION
  handleChangeEditMaterial = (e, { name, value }) => {
    this.setState({
      editMaterial: { ...this.state.editMaterial, [name]: value.toUpperCase() }
    });
  };

  handleSaveEditMaterial = e => {
    const { name, suplier, unit, type } = this.state.editMaterial;
    if (name && suplier && unit && type) {
      API.put("material/" + this.state.editMaterial.id, this.state.editMaterial)
        .then(({ status, data, headers }) => {
          console.log(headers);
          if (status === 200) {
            const m = this.state.materials.filter(x => x.id !== data.id);
            const materials = [data, ...m];
            this.setState({ materials });
            this.handleEditMaterialClose();
            Toast("Material edited!").fire();
          }
        })
        .catch(error => {
          if (error.response) {
            if (error.response.status === 400) {
              this.setState({
                editMaterialError: true,
                editMaterialErrorMsg: error.response.data.error
              });
            } else if (error.response.status >= 500) {
              Toast("Server Error!", "error").fire();
            }
          }
        });
    } else {
      this.setState({
        editMaterialError: true,
        editMaterialErrorMsg: "Field Can't be Empty!"
      });
    }
    e.preventDefault();
  };

  handleEditMaterialOpen = data => {
    this.setState({ editMaterial: data });
    this.setState({ editMaterialOpen: true });
  };

  handleEditMaterialClose = () => {
    this.setState({ editMaterialOpen: false });
  };
  //#endregion

  render() {
    const {
      materials,
      addMaterialError,
      addMaterial,
      addMaterialOpen,
      addMaterialErrorMsg,
      editMaterialError,
      editMaterial,
      editMaterialOpen,
      editMaterialErrorMsg
    } = this.state;

    const headerRow = [
      {
        key: 1,
        content: "MATERIAL ID",
        name: "id"
      },
      { key: 2, content: "MATERIAL NAME", name: "name" },
      { key: 3, content: "SUPLIER", name: "suplier" },
      { key: 4, content: "UNIT" },
      { key: 5, content: "" }
    ];
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
                  <Button
                    icon="edit"
                    onClick={() => this.handleEditMaterialOpen(data)}
                  />
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
              onChange={this.handleChangeAddMaterial}
              placeholder="Material Name"
            />
            <Form.Input
              label="Suplier"
              onChange={this.handleChangeAddMaterial}
              name="suplier"
              value={addMaterial.suplier}
              placeholder="Suplier"
            />
            <Form.Group widths="equal">
              <Form.Select
                onChange={this.handleChangeAddMaterial}
                fluid
                placeholder={"Select type material"}
                name="type"
                label="Type"
                value={addMaterial.type}
                options={TypeList}
              />
              <Form.Select
                onChange={this.handleChangeAddMaterial}
                fluid
                placeholder={"Select unit material"}
                name="unit"
                label="Unit"
                value={addMaterial.unit}
                options={UnitList}
              />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="grey" onClick={this.handleAddMaterialClear}>
            <Icon name="x" /> CLEAR
          </Button>
          <Button color="blue" onClick={this.handleSaveAddMaterial}>
            <Icon name="save" /> SAVE
          </Button>
        </Modal.Actions>
      </Modal>
    );

    const EditMaterialModal = (
      <Modal
        closeOnDimmerClick={false}
        closeIcon
        size="small"
        open={editMaterialOpen}
        onClose={this.handleEditMaterialClose}
      >
        <Modal.Header>EDIT MATERIAL</Modal.Header>
        <Modal.Content>
          <Form error={editMaterialError}>
            <Message error header="ERROR" content={editMaterialErrorMsg} />
            <Form.Input
              label="Material Name"
              name="name"
              readOnly
              value={editMaterial.id}
              placeholder="Material ID"
            />
            <Form.Input
              label="Material Name"
              name="name"
              value={editMaterial.name}
              onChange={this.handleChangeEditMaterial}
              placeholder="Material Name"
            />
            <Form.Input
              label="Suplier"
              onChange={this.handleChangeEditMaterial}
              name="suplier"
              value={editMaterial.suplier}
              placeholder="Suplier"
            />
            <Form.Group widths="equal">
              <Form.Select
                onChange={this.handleChangeEditMaterial}
                fluid
                name="type"
                label="Type"
                options={TypeList}
                value={editMaterial.type}
              />
              <Form.Select
                onChange={this.handleChangeEditMaterial}
                fluid
                name="unit"
                label="Unit"
                options={UnitList}
                value={editMaterial.unit}
              />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="blue" onClick={this.handleSaveEditMaterial}>
            <Icon name="save" /> SAVE
          </Button>
        </Modal.Actions>
      </Modal>
    );

    return (
      <React.Fragment>
        {AddMaterialModal}
        {EditMaterialModal}
        <Segment raised piled>
          <MyTable
            title="MATERIAL"
            headerRow={headerRow}
            renderBodyRow={renderBodyRow}
            data={materials}
            orderBy={"name"}
            orderDirection={"asc"}
            actionBar={true}
            button={<Button.Group>{buttonAdd}</Button.Group>}
          />
        </Segment>
      </React.Fragment>
    );
  }
}

export default Material;
