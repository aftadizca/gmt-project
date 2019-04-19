import React, { Component } from "react";
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

import { Loading } from "../_helper/CostumToast";
import { UnitList } from "../_helper/SelectList";
import { TypeList } from "./../_helper/SelectList";
import { TITLE } from "../_helper/constant";
import { AppContext } from "./../AppProvider";
import TableButton from "./../_common/TableButton";

class Material extends Component {
  static contextType = AppContext;
  state = {
    addMaterial: { id: "", name: "", suplier: "", type: "", unit: "" },
    addMaterialError: false,
    addMaterialErrorMsg: "",
    addMaterialOpen: false,
    editMaterial: { id: "", name: "", suplier: "", type: "", unit: "" },
    editMaterialError: false,
    editMaterialErrorMsg: "",
    editMaterialOpen: false,
    rowActive: ""
  };

  componentDidMount() {
    console.log("Material DidMounted");
  }

  timeOut = () => {
    setTimeout(() => {
      this.setState({ rowActive: "" });
    }, 5000);
  };

  handleDetail = movie => {
    console.log(movie);
  };

  handleDelete = data => {
    this.context.handleDelete("material", data);
  };

  //#region ADD MATERIAL ACTION
  handleChangeAddMaterial = (e, { name, value }) => {
    this.setState({
      addMaterial: { ...this.state.addMaterial, [name]: value.toUpperCase() }
    });
  };

  handleSaveAddMaterial = () => {
    Loading.fire();
    const { name, suplier, unit, type } = this.state.addMaterial;
    if (name && suplier && unit && type) {
      this.context.postAPI(
        "material",
        this.state.addMaterial,
        data => {
          this.setState({ rowActive: data.id });
          this.timeOut();
          this.handleAddMaterialClose();
          this.handleAddMaterialClear();
        },
        response => {
          this.setState({
            addMaterialError: true,
            addMaterialErrorMsg: response.data.error
          });
        }
      );
    } else {
      this.setState({
        addMaterialError: true,
        addMaterialErrorMsg: "Field Can't be Empty!"
      });
    }
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
      this.context.putAPI(
        "material",
        this.state.editMaterial.id,
        this.state.editMaterial,
        () => {
          this.handleEditMaterialClose();
          this.setState({ rowActive: this.state.editMaterial.id });
          this.timeOut();
        },
        response =>
          this.setState({
            editMaterialError: true,
            editMaterialErrorMsg: response.data.error
          })
      );
    } else {
      this.setState({
        editMaterialError: true,
        editMaterialErrorMsg: "Field Can't be Empty!"
      });
    }
  };

  handleEditMaterialOpen = data => {
    this.setState({ editMaterial: data });
    this.setState({ editMaterialOpen: true });
  };

  handleEditMaterialClose = () => {
    this.setState({ editMaterialOpen: false });
    console.log("sasas");
  };
  //#endregion

  render() {
    console.log("Material render");
    document.title = "MATERIAL - " + TITLE;
    const {
      addMaterialError,
      addMaterial,
      addMaterialOpen,
      addMaterialErrorMsg,
      editMaterialError,
      editMaterial,
      editMaterialOpen,
      editMaterialErrorMsg
    } = this.state;

    const { materials } = this.context;

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
      active: this.state.rowActive === data.id,
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

    const AddMaterialModal = (
      <Modal
        closeOnDimmerClick={false}
        closeIcon
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
            orderBy={"id"}
            orderDirection={"desc"}
            actionBar={true}
            button={
              <Button.Group>
                <TableButton
                  title="ADD"
                  icon="add"
                  onClick={this.handleAddMaterialOpen}
                />
              </Button.Group>
            }
          />
        </Segment>
      </React.Fragment>
    );
  }
}

export default Material;
