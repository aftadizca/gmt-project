import React, { Component } from "react";
import MyTable from "./../_common/MyTable";
import { Segment, Button, Icon, Modal, Form, Message } from "semantic-ui-react";
import { UnitList } from "../_helper/SelectList";
import { TypeList } from "./../_helper/SelectList";
import { TITLE } from "../_helper/constant";
import { AppContext } from "./../AppProvider";

class Material extends Component {
  static contextType = AppContext;
  state = {
    activeModal: "",
    selectedRow: [],
    material: { id: "", name: "", suplier: "", type: "", unit: "" },
    modalError: { error: false, msg: "" }
  };

  componentDidMount() {
    // console.log("Material DidMounted");
  }

  handleDelete = () => {
    const dataToDelete = this.state.selectedRow.map(x => {
      return { ...x, isDeleted: true };
    });
    this.context.deleteAPI("material", dataToDelete, () =>
      this.setState({ selectedRow: [] })
    );
  };

  //handle open and close Modal
  handleModal = (e, data) => {
    if (this.state.activeModal === data.action) {
      this.setState({ activeModal: "" });
      this.setState({ material: {} });
      this.setState({ modalError: { error: false, msg: "" } });
    } else {
      if (data.action === "EDIT_MATERIAL") {
        this.setState({ material: this.state.selectedRow[0] });
      }
      this.setState({ activeModal: data.action });
    }
  };

  //handle when input change in form
  handleInputOnChange = (e, { name, value }) => {
    this.setState({
      material: { ...this.state.material, [name]: value.toUpperCase() }
    });
  };

  //handle submit form
  handleSubmit = (e, data) => {
    const { name, suplier, unit, type } = this.state.material;
    if (name && suplier && unit && type) {
      if (data.action === "Edit") {
        this.context.putAPI(
          "material",
          this.state.material,
          () => {
            this.setState({
              activeModal: "",
              selectedRow: []
            });
            this.handleMaterialClear();
          },
          response =>
            this.setState({
              modalError: { error: true, msg: response.data }
            })
        );
      } else if (data.action === "Add") {
        this.context.postAPI(
          "material",
          this.state.material,
          () => {
            this.setState({
              activeModal: "",
              selectedRow: []
            });
            this.handleMaterialClear();
          },
          response => {
            this.setState({
              modalError: { error: true, msg: response.data }
            });
          }
        );
      }
    } else {
      this.setState({
        modalError: { error: true, msg: "Field can't be empty!" }
      });
    }
  };

  //handle table selection
  handleSelection = data => {
    this.setState({ selectedRow: data });
  };

  //clear state material and modalError
  handleMaterialClear = () => {
    this.setState({
      material: { id: "", name: "", suplier: "", type: "", unit: "" },
      modalError: { error: false, msg: "" }
    });
  };

  render() {
    document.title = "MATERIAL - " + TITLE;
    const { modalError, activeModal, selectedRow, material } = this.state;

    const { materials } = this.context;

    const headerRow = [
      {
        key: 1,
        content: "MATERIAL ID",
        name: "id"
      },
      { key: 2, content: "MATERIAL NAME", name: "name" },
      { key: 3, content: "SUPLIER", name: "suplier" },
      { key: 4, content: "UNIT" }
    ];
    const renderBodyRow = (data, i) => ({
      key: `row-${i}`,
      disabled: data.isDeleted,
      cells: [data.id, data.name, data.suplier, data.unit]
    });
    const buttonFooter = (
      <Button.Group>
        <MyTable.Button
          label="Refresh"
          icon="refresh"
          onClick={() => this.context.getAPI(["material"])}
        />
        <MyTable.Button
          label="Add"
          action="ADD_MATERIAL"
          icon="add"
          onClick={this.handleModal}
        />
        <MyTable.Button
          label="Edit"
          icon="edit"
          action="EDIT_MATERIAL"
          disabled={selectedRow.length !== 1}
          onClick={this.handleModal}
        />
        <MyTable.Button
          label="Delete"
          icon="delete"
          color="red"
          action="DELETE_MATERIAL"
          disabled={selectedRow.length < 1}
          onClick={this.handleDelete}
        />
      </Button.Group>
    );

    const AddMaterialModal = (
      <Modal
        closeOnDimmerClick={false}
        closeIcon
        size="small"
        title="Add"
        open={activeModal === "ADD_MATERIAL"}
        onClose={this.handleModal}
      >
        <Modal.Header>ADD MATERIAL</Modal.Header>
        <Modal.Content>
          <Form error={modalError.error}>
            <Message error header="ERROR" content={modalError.msg} />
            <Form.Input
              label="Material Name"
              name="name"
              value={material.name}
              onChange={this.handleInputOnChange}
              placeholder="Material Name"
            />
            <Form.Input
              label="Suplier"
              onChange={this.handleInputOnChange}
              name="suplier"
              value={material.suplier}
              placeholder="Suplier"
            />
            <Form.Group widths="equal">
              <Form.Select
                onChange={this.handleInputOnChange}
                fluid
                placeholder={"Select type material"}
                name="type"
                label="Type"
                value={material.type}
                options={TypeList}
              />
              <Form.Select
                onChange={this.handleInputOnChange}
                fluid
                placeholder={"Select unit material"}
                name="unit"
                label="Unit"
                value={material.unit}
                options={UnitList}
              />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="grey" onClick={this.handleMaterialClear}>
            <Icon name="x" /> CLEAR
          </Button>
          <Button color="blue" action="Add" onClick={this.handleSubmit}>
            <Icon name="save" /> SAVE
          </Button>
        </Modal.Actions>
      </Modal>
    );

    const EditMaterialModal = (
      <Modal
        closeOnDimmerClick={false}
        closeIcon
        title="Edit"
        size="small"
        open={activeModal === "EDIT_MATERIAL"}
        onClose={this.handleModal}
      >
        <Modal.Header>EDIT MATERIAL</Modal.Header>
        <Modal.Content>
          <Form error={modalError.error}>
            <Message error header="ERROR" content={modalError.msg} />
            <Form.Input
              label="Material Name"
              name="name"
              readOnly
              value={material.id}
              placeholder="Material ID"
            />
            <Form.Input
              label="Material Name"
              name="name"
              value={material.name}
              onChange={this.handleInputOnChange}
              placeholder="Material Name"
            />
            <Form.Input
              label="Suplier"
              onChange={this.handleInputOnChange}
              name="suplier"
              value={material.suplier}
              placeholder="Suplier"
            />
            <Form.Group widths="equal">
              <Form.Select
                onChange={this.handleInputOnChange}
                fluid
                name="type"
                label="Type"
                options={TypeList}
                value={material.type}
              />
              <Form.Select
                onChange={this.handleInputOnChange}
                fluid
                name="unit"
                label="Unit"
                options={UnitList}
                value={material.unit}
              />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="blue" action="Edit" onClick={this.handleSubmit}>
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
            header={headerRow}
            body={renderBodyRow}
            data={materials.filter(x => !x.isDeleted)}
            orderBy={0}
            selection
            selectedRow={selectedRow}
            onSelectedChange={this.handleSelection}
            orderDirection="desc"
            searchBar
            button={buttonFooter}
          />
        </Segment>
      </React.Fragment>
    );
  }
}

export default Material;
