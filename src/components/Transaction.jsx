//#region IMPORT
import React, { Component } from "react";
import {
  Tab,
  Icon,
  Label,
  Menu,
  Modal,
  Form,
  Button,
  Table,
  Header,
  Segment
} from "semantic-ui-react";
import MyTable from "./../_common/MyTable";
import {
  TITLE,
  LOCALE_DATE,
  OPTIONS_DATE,
  STATUS_COLOR,
  INCOMING,
  STOK,
  CLEAVE_DATE_OPTIONS,
  TAB,
  OUTCOMING,
  NEW_STOK,
  NEW_INCOMING,
  MODAL_DEFAULT
} from "../_helper/constant";
import { AppContext } from "./../AppProvider";
import LabelTab from "./../_common/LabelTab";
import { NavLink, Link } from "react-router-dom";
import QCButton from "../_common/QCButton";
import { DinamicList } from "../_helper/SelectList";
import { Toast, Loading } from "./../_helper/CostumToast";
import _ from "lodash";
import { DB } from "./../_helper/constant";
import CleaveMod from "./../_common/CleaveMod";
import { checkForm } from "../_helper/tool";
import { filterWithArray } from "./../_helper/tool";
//#endregion

class Transaction extends Component {
  static contextType = AppContext;

  state = {
    selectedRow: [],
    selectedMaterial: [],
    selectedMaterial2: [],
    selectedRowEdit: "",
    modalStatusQC: false,
    currentPageModal: 1,
    modal: { ...MODAL_DEFAULT },
    newStok: { ...NEW_STOK },
    newOutcoming: { ...NEW_INCOMING }
  };

  //#region EVENT

  handleDelete = () => {
    const dataToDelete = this.state.selectedRow.map(x => {
      return { ...x, isDeleted: true };
    });
    this.context.deleteAPI("stok", dataToDelete, () =>
      this.setState({ selectedRow: [] })
    );
  };

  handleOnChangeQC = _.debounce(
    (e, data) => {
      console.log("handleOnChangeQC", { e, data });
      const selectedRowEdit = [...this.state.selectedRowEdit];
      selectedRowEdit[data.selectedrowindex] = {
        ...selectedRowEdit[data.selectedrowindex],
        [data.name]: data.value
      };
      this.setState({ selectedRowEdit });
    },
    500,
    { leading: true, trailing: true }
  );

  handleOnChangeAdd = _.debounce(
    (e, data) => {
      //console.log("handleOnChangeAdd", { e, data });
      let newStok = { ...this.state.newStok, [data.name]: data.value };
      this.setState({ newStok });
    },
    500,
    { leading: true, trailing: true }
  );

  handleOnChangeEdit = _.debounce(
    (e, data) => {
      console.log("handleEdit", { data });
      let selectedRowEdit;
      if (data.value) {
        selectedRowEdit = [
          {
            ...this.state.selectedRowEdit[0],
            [data.name]: data.value
          }
        ];
      } else {
        selectedRowEdit = [
          {
            ...this.state.selectedRowEdit[0],
            [data.name]: data.placeholder
          }
        ];
      }

      this.setState({ selectedRowEdit });
    },
    500,
    { leading: true, trailing: true }
  );

  handleOnChangeAddOutcoming = _.debounce(
    (e, data) => {
      //console.log("handleOnChangeAdd", { e, data });
      let newOutcoming = {
        ...this.state.newOutcoming,
        [data.name]: data.value
      };
      this.setState({ newOutcoming });
    },
    500,
    { leading: true, trailing: true }
  );
  handleOnChangeEditOutcoming = _.debounce(
    (e, data) => {
      console.log("handleEdit", { data });
      let newOutcoming;
      if (data.value) {
        newOutcoming = [
          {
            ...this.state.newOutcoming,
            [data.name]: data.value
          }
        ];
      } else {
        newOutcoming = [
          {
            ...this.state.newOutcoming,
            [data.name]: data.placeholder
          }
        ];
      }

      this.setState({ newOutcoming });
    },
    500,
    { leading: true, trailing: true }
  );

  //handle open and close modal
  handleModal = (e, data) => {
    //close modal and reset state
    console.log("handleModal", { e, data });
    if (data.eventPool === "Modal" && data.open) {
      this.resetModal();
      return;
    }
    Loading.fire();
    switch (data.action) {
      case STOK.updateQC:
        const selectedRowEdit = this.state.selectedRow.map(x => {
          return { ...x, statusQCID: data.statusid };
        });
        //jika lokasi kosong tampilkan modal
        if (_.find(selectedRowEdit, ["locationID", "0"])) {
          this.setState({
            selectedRowEdit,
            modal: {
              ...this.state.modal,
              firstModal: { active: data.action, error: "" }
            }
          });
          //jika ada lokasi do update StatusQC
        } else {
          this.setState({ selectedRowEdit }, () =>
            this.handleSubmit(e, { action: data.action })
          );
        }
        break;
      case OUTCOMING.view:
        const selectedRow = filterWithArray(
          this.context.stoks,
          this.state.newOutcoming.stokMaterialOut,
          "id",
          "stokID"
        );
        this.setState({
          selectedRowEdit: data.data,
          modal: {
            ...this.state.modal,
            firstModal: { active: data.action, error: "" }
          },
          selectedRow
        });
        break;
      case OUTCOMING.add:
        this.setState({
          modal: {
            ...this.state.modal,
            firstModal: { active: data.action, error: "" }
          }
        });
        break;
      case OUTCOMING.addMaterial:
        this.setState({
          modal: {
            ...this.state.modal,
            secondModal: { active: data.action, error: "" }
          }
        });
        break;
      case OUTCOMING.closeSecondModal:
        this.setState({
          modal: {
            ...this.state.modal,
            secondModal: { active: "", error: "" }
          }
        });
        break;
      case OUTCOMING.edit:
        const selectedMaterial = filterWithArray(
          this.context.stoks,
          this.state.selectedRow[0].stokMaterialOut,
          "id",
          "stokID"
        );
        this.setState({
          modal: {
            ...this.state.modal,
            firstModal: { active: data.action, error: "" }
          },
          newOutcoming: { ...this.state.selectedRow[0] },
          selectedMaterial: selectedMaterial,
          selectedMaterial2: selectedMaterial
        });
        break;

      default:
        this.setState({
          selectedRowEdit: [...this.state.selectedRow],
          modal: {
            ...this.state.modal,
            firstModal: { active: data.action, error: "" }
          }
        });
        break;
    }
    Loading.clickConfirm();
  };

  // modal next and prev page
  handlePageModal = (e, data) => {
    if (data.action === "P") {
      this.setState({ currentPageModal: this.state.currentPageModal - 1 });
    } else {
      this.setState({ currentPageModal: this.state.currentPageModal + 1 });
    }
  };

  //reset modal state
  resetModal = () => {
    this.setState({
      selectedRow: [],
      currentPageModal: 1,
      selectedRowEdit: "",
      selectedMaterial: [],
      selectedMaterial2: [],
      modal: { ...MODAL_DEFAULT },
      newStok: { ...NEW_STOK },
      newOutcoming: { ...NEW_INCOMING }
    });
  };

  //handle submit Form
  handleSubmit = (e, data) => {
    console.log("handleSubmit", { e, data });
    const { selectedRowEdit } = this.state;
    let newOutcoming = {};
    switch (data.action) {
      case STOK.updateQC:
        this.context.putAPI(
          "stok",
          selectedRowEdit,
          () => {
            this.resetModal();
            this.setState({ selectedRow: [] });
            this.context.locationMap();
            Toast("Item successfully edited!");
          },
          response => Toast(response.data, "error")
        );
        break;
      case INCOMING.add:
        const newStok = {
          ...this.state.newStok,
          expiredDate: new Date(this.state.newStok.expiredDate).toISOString()
        };
        this.context.postAPI(
          "stok",
          newStok,
          () => {
            this.resetModal();
          },
          () => Toast("Opps.. Something wrong.. Try Again!", "error")
        );
        break;

      case INCOMING.edit:
        const putData = [
          {
            ...selectedRowEdit[0],
            expiredDate: new Date(selectedRowEdit[0].expiredDate).toISOString()
          }
        ];
        this.context.putAPI(
          "stok",
          putData,
          () => {
            this.resetModal();
            this.setState({ selectedRow: [], selectedRowEdit: [] });
            this.context.locationMap();
            Toast("Item successfully edited!");
          },
          response => Toast(response.data, "error")
        );
        break;

      case OUTCOMING.add:
        newOutcoming = {
          ...this.state.newOutcoming,
          stokMaterialOut: this.state.selectedMaterial.map(x => {
            return { stokID: x.id };
          })
        };
        this.context.postAPI(
          "materialout",
          newOutcoming,
          () => {
            this.resetModal();
            this.context.getAPI(["stok"], () =>
              Toast("Item successfully edited!")
            );
          },
          () => Toast("Opps.. Something wrong.. Try Again!", "error")
        );
        break;
      case OUTCOMING.edit:
        newOutcoming = {
          ...this.state.newOutcoming,
          stokMaterialOut: this.state.selectedMaterial.map(x => {
            return { stokID: x.id };
          })
        };
        this.context.putAPI(
          "materialout",
          newOutcoming,
          () => {
            this.resetModal();
            this.context.getAPI(["stok"], () =>
              Toast("Item successfully edited!")
            );
          },
          () => Toast("Opps.. Something wrong.. Try Again!", "error")
        );
        break;
      default:
        break;
    }
  };

  //handle selection in Table
  handleSelectedChange = data => {
    this.setState({ selectedRow: data });
  };
  handleSelectedStok = data => {
    this.setState({ selectedMaterial: data });
  };

  handleTabChange = () => {
    this.setState({ selectedRow: [] });
  };

  //#endregion

  render() {
    document.title = this.props.match.params.tab.toUpperCase() + " - " + TITLE;

    //#region DESTUCTURING STATE & PROPS
    const { locationmaps, stoks, useRelation, materialouts } = this.context;
    const {
      selectedRow,
      selectedRowEdit,
      newStok,
      currentPageModal,
      newOutcoming,
      selectedMaterial,
      modal: { firstModal, secondModal }
    } = this.state;
    const {
      match: {
        params: { tab }
      }
    } = this.props;
    //#endregion

    //#region DATA PREPARATION
    const incoming =
      tab === "incoming" &&
      stoks.filter(x => x.statusQCID === "1" && !x.isDeleted && !x.isOut);
    const stokAll =
      tab === "stok" &&
      stoks.filter(x => x.statusQCID !== "1" && !x.isDeleted && !x.isOut);
    const outcoming =
      tab === "outcoming" && materialouts.filter(x => !x.isDeleted);
    //#endregion

    //#region HEADER & BODY BUILDER
    const materialStockHeader = [
      { key: 1, content: "TRACE ID", name: "id" },
      {
        key: 2,
        content: "MATERIAL NAME",
        name: "materialID",
        table: DB.materials
      },
      {
        key: 9,
        content: "SUPLIER",
        name: "materialID",
        table: DB.materials,
        skip: "true"
      },
      {
        key: 3,
        content: "LOCATION",
        name: "locationID",
        table: DB.locationmaps,
        skip: "true"
      },
      { key: 5, content: "LOT", name: "lot" },
      { key: 6, content: "INCOMING DATE", name: "comingDate" },
      { key: 7, content: "EXP", name: "expiredDate" },
      { key: 8, content: "QTY", name: "qty" },
      { key: 4, content: "STATUS QC", name: "statusQCID", skip: "true" }
    ];
    const materialStockRow = (data, i) => ({
      key: `row-${i}`,
      cells: [
        data.id,
        {
          key: `material-${i}`,
          content: useRelation(DB.materials, data.materialID, "name")
        },
        {
          key: `suplier-${i}`,
          content: useRelation(DB.materials, data.materialID, "suplier")
        },
        {
          key: `location-${i}`,
          content: useRelation(DB.locationmaps, data.locationID, "name") || (
            <Icon name="question" color="red" size="small" />
          )
        },
        data.lot,
        {
          key: `comingDate-${i}`,
          content: new Date(Date.parse(data.comingDate)).toLocaleDateString(
            LOCALE_DATE,
            OPTIONS_DATE
          )
        },
        {
          key: `exp-${i}`,
          content: new Date(Date.parse(data.expiredDate)).toLocaleDateString(
            LOCALE_DATE,
            OPTIONS_DATE
          )
        },
        data.qty,
        {
          key: `statusQC-${i}`,
          content: (
            <Label tag color={STATUS_COLOR[data.statusQCID]}>
              {useRelation(DB.statusQCs, data.statusQCID, "name")}
            </Label>
          )
        }
      ]
    });
    const materialStockRowPlain = (data, i) => ({
      key: `row-${i}`,
      cells: [
        data.id,
        {
          key: `material-${i}`,
          content: useRelation(DB.materials, data.materialID, "name")
        },
        {
          key: `suplier-${i}`,
          content: useRelation(DB.materials, data.materialID, "suplier")
        },
        {
          key: `location-${i}`,
          content: useRelation(DB.locationmaps, data.locationID, "name") || (
            <Icon name="question" color="red" size="small" />
          )
        },
        data.lot,
        {
          key: `comingDate-${i}`,
          content: new Date(Date.parse(data.comingDate)).toLocaleDateString(
            LOCALE_DATE,
            OPTIONS_DATE
          )
        },
        {
          key: `exp-${i}`,
          content: new Date(Date.parse(data.expiredDate)).toLocaleDateString(
            LOCALE_DATE,
            OPTIONS_DATE
          )
        },
        data.qty,
        {
          key: `statusQC-${i}`,
          content: useRelation(DB.statusQCs, data.statusQCID, "name")
        }
      ]
    });
    const outcomingHeader = [
      { key: 1, content: "OUTCOMING ID", name: "id" },
      { key: 2, content: "RECEIVER", name: "receiverName" },
      { key: 3, content: "DEPARTEMENT", name: "receiverDepartement" },
      { key: 4, content: "DATE", name: "date" }
    ];
    const outcomingRow = (data, i) => ({
      key: `row-${i}`,
      cells: [
        {
          key: `id${i}`,
          content: <Button className={"link"}>{data.id}</Button>,
          onClick: e => this.handleModal(e, { action: OUTCOMING.view, data }),
          className: "tablelink"
        },
        { key: `rec${i}`, content: data.receiverName },
        { key: `dept${i}`, content: data.receiverDepartement },
        {
          key: `exp-${i}`,
          content: new Date(Date.parse(data.date)).toLocaleDateString(
            LOCALE_DATE,
            OPTIONS_DATE
          )
        }
      ]
    });
    //#endregion

    //#region BUTTON BAR
    const incomingButton = (
      <React.Fragment>
        <Button.Group>
          <MyTable.Button
            label="Refresh"
            icon="refresh"
            onClick={() => this.context.getAPI(["stok"])}
          />
          <MyTable.Button
            label="Add"
            action={INCOMING.add}
            icon="add"
            onClick={this.handleModal}
          />
          <MyTable.Button
            label="Edit"
            icon="edit"
            action={INCOMING.edit}
            disabled={!(selectedRow.length === 1)}
            onClick={this.handleModal}
          />
          <MyTable.Button
            label="Delete"
            icon="x"
            disabled={!(selectedRow.length !== 0)}
            onClick={this.handleDelete}
          />
        </Button.Group>{" "}
        <QCButton
          button={this.context.statusQCs}
          disabled={!(selectedRow.length > 0)}
          onClick={this.handleModal}
        />
      </React.Fragment>
    );
    const stockButton = (
      <React.Fragment>
        <Button.Group>
          <MyTable.Button
            label="Refresh"
            icon="refresh"
            onClick={() => this.context.getAPI(["stok"])}
          />
          <MyTable.Button
            label="Edit"
            icon="edit"
            action={STOK.edit}
            disabled={!(selectedRow.length === 1)}
            onClick={this.handleModal}
          />
        </Button.Group>{" "}
        <QCButton
          button={this.context.statusQCs}
          disabled={!(selectedRow.length > 0)}
          onClick={this.handleModal}
        />
      </React.Fragment>
    );
    const outcomingButton = (
      <React.Fragment>
        <Button.Group>
          <MyTable.Button
            label="Refresh"
            icon="refresh"
            onClick={() => this.context.getAPI(["materialout"])}
          />
          <MyTable.Button
            label="Add"
            icon="add"
            action={OUTCOMING.add}
            onClick={this.handleModal}
          />
          <MyTable.Button
            label="Edit"
            icon="edit"
            action={OUTCOMING.edit}
            disabled={!(selectedRow.length === 1)}
            onClick={this.handleModal}
          />
        </Button.Group>{" "}
      </React.Fragment>
    );
    //#endregion

    //#region MODAL
    const updateStatusModal = firstModal.active === STOK.updateQC && (
      <Modal
        closeOnDimmerClick={false}
        closeIcon
        size="small"
        open={firstModal.active === STOK.updateQC}
        onClose={this.handleModal}
      >
        <Modal.Header>
          <Segment inverted color="blue">
            <Header
              as="h2"
              icon="edit outline"
              inverted
              content={`UPDATE STATUS QC - 
              ${currentPageModal} / ${selectedRow.length}`}
            />
          </Segment>
        </Modal.Header>
        <Modal.Content>
          <Form>
            <CleaveMod
              label="TRACE ID"
              name="id"
              readOnly
              value={selectedRowEdit[currentPageModal - 1].id}
            />
            <CleaveMod
              label="MATERIAL NAME"
              name="name"
              readOnly
              value={useRelation(
                DB.materials,
                selectedRowEdit[currentPageModal - 1].materialID,
                "name"
              )}
            />
            <Form.Group widths="equal">
              <CleaveMod
                label="STATUS QC"
                name="statusQCID"
                readOnly
                fluid
                value={useRelation(
                  DB.statusQCs,
                  selectedRowEdit[currentPageModal - 1].statusQCID,
                  "name"
                )}
              />
              <Form.Dropdown
                name="locationID"
                label={
                  <Label content="LOCATION" pointing="below" color="blue" />
                }
                placeholder="Select Location"
                search
                fluid
                selection
                selectedrowindex={currentPageModal - 1}
                onChange={this.handleOnChangeQC}
                options={DinamicList(
                  locationmaps.filter(x => x.traceID === ""),
                  "id",
                  x => x.name
                )}
                value={selectedRowEdit[currentPageModal - 1].locationID}
              />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button.Group floated="left">
            <Button
              content="Previous"
              action="P"
              icon="left arrow"
              labelPosition="left"
              color="blue"
              onClick={this.handlePageModal}
              disabled={currentPageModal === 1}
            />
            <Button
              content="Next"
              action="N"
              icon="right arrow"
              labelPosition="right"
              color="blue"
              onClick={this.handlePageModal}
              disabled={currentPageModal === selectedRowEdit.length}
            />
          </Button.Group>
          <Button
            color="blue"
            onClick={this.handleSubmit}
            disabled={_.some(selectedRowEdit, ["locationID", "0"])}
            action={STOK.updateQC}
          >
            <Icon name="save" /> SAVE
          </Button>
        </Modal.Actions>
      </Modal>
    );
    const addIncomingModal = firstModal.active === INCOMING.add && (
      <Modal
        closeOnDimmerClick={false}
        closeIcon
        size="small"
        open={firstModal.active === INCOMING.add}
        onClose={this.handleModal}
      >
        <Modal.Header>
          <Segment inverted color="blue">
            <Header
              as="h2"
              icon="add"
              inverted
              content="ADD INCOMING MATERIAL"
            />
          </Segment>
        </Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Dropdown
              label={
                <Label content="MATERIAL NAME" pointing="below" color="blue" />
              }
              name="materialID"
              placeholder="MATERIAL - SUPLIER"
              search
              fluid
              selection
              options={DinamicList(
                this.context[DB.materials],
                "id",
                x => `${x.name} - ${x.suplier}`
              )}
              onChange={this.handleOnChangeAdd}
              value={newStok.materialID}
            />
            <CleaveMod
              label="EXPIRED DATE"
              placeholder="MM/DD/YYYY"
              name="expiredDate"
              onChange={this.handleOnChangeAdd}
              options={CLEAVE_DATE_OPTIONS.date}
            />
            <CleaveMod
              label="LOT / PRODUCTION CODE"
              name="lot"
              placeholder="LOT"
              options={{ uppercase: true }}
              onChange={this.handleOnChangeAdd}
            />
            <Form.Group widths="equal">
              <CleaveMod
                label={"TOTAL INCOMING"}
                name="qty"
                placeholder="TOTAL INCOMING"
                onChange={this.handleOnChangeAdd}
                rawValue={true}
                options={CLEAVE_DATE_OPTIONS.numeric}
              />
              <CleaveMod
                label="QTY PER PALLET"
                name="pallet"
                placeholder="QTY PER PALLET"
                rawValue={true}
                onChange={this.handleOnChangeAdd}
                options={CLEAVE_DATE_OPTIONS.numeric}
              />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="blue"
            onClick={this.handleSubmit}
            disabled={!checkForm(newStok)}
            action={INCOMING.add}
          >
            <Icon name="save" /> SAVE
          </Button>
        </Modal.Actions>
      </Modal>
    );
    const editIncomingModal = firstModal.active === INCOMING.edit && (
      <Modal
        closeOnDimmerClick={false}
        closeIcon
        size="small"
        open={firstModal.active === INCOMING.edit}
        onClose={this.handleModal}
      >
        <Modal.Header>
          <Segment inverted color="blue">
            <Header
              as="h2"
              icon="edit outline"
              inverted
              content="EDIT INCOMING MATERIAL"
            />
          </Segment>
        </Modal.Header>
        <Modal.Content>
          <Form>
            <CleaveMod
              label="TRACE ID"
              name="id"
              readOnly
              value={selectedRow.length && selectedRow[0].id}
            />
            <Form.Dropdown
              label={
                <Label content="MATERIAL NAME" pointing="below" color="blue" />
              }
              name="materialID"
              placeholder="MATERIAL - SUPLIER"
              search
              fluid
              selection
              options={DinamicList(
                this.context[DB.materials],
                "id",
                x => `${x.name} - ${x.suplier}`
              )}
              onChange={this.handleOnChangeEdit}
              value={selectedRowEdit.length && selectedRowEdit[0].materialID}
            />
            <Form.Group widths="equal">
              <CleaveMod
                label="QTY"
                name="qty"
                rawValue={true}
                placeholder={selectedRow.length && selectedRow[0].qty}
                onChange={this.handleOnChangeEdit}
                options={CLEAVE_DATE_OPTIONS.numeric}
              />
              <CleaveMod
                label="EXPIRED DATE"
                name="expiredDate"
                placeholder={
                  selectedRowEdit.length &&
                  new Date(
                    Date.parse(selectedRow[0].expiredDate)
                  ).toLocaleDateString(LOCALE_DATE, OPTIONS_DATE)
                }
                onChange={this.handleOnChangeEdit}
                options={CLEAVE_DATE_OPTIONS.date}
              />
              <CleaveMod
                label="LOT NUMBER"
                name="lot"
                placeholder={selectedRow.length && selectedRow[0].lot}
              />
              <Form.Dropdown
                name="locationID"
                label={
                  <Label content="LOCATION" pointing="below" color="blue" />
                }
                placeholder="Select Location"
                search
                fluid
                selection
                onChange={this.handleOnChangeEdit}
                options={DinamicList(
                  locationmaps.filter(
                    x =>
                      x.traceID === "" ||
                      (selectedRow.length &&
                        x.locationID !== selectedRow[0].locationID)
                  ),
                  "id",
                  x => x.name
                )}
                value={selectedRowEdit.length && selectedRowEdit[0].locationID}
              />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="blue"
            onClick={this.handleSubmit}
            action={INCOMING.edit}
          >
            <Icon name="save" /> SAVE
          </Button>
        </Modal.Actions>
      </Modal>
    );
    const editStokModal = firstModal.active === STOK.edit && (
      <Modal
        closeOnDimmerClick={false}
        closeIcon
        size="small"
        open={firstModal.active === STOK.edit}
        onClose={this.handleModal}
      >
        <Modal.Header>
          <Segment inverted color="blue">
            <Header
              as="h2"
              icon="edit outline"
              inverted
              content="EDIT STOK MATERIAL"
            />
          </Segment>
        </Modal.Header>
        <Modal.Content>
          <Form>
            <CleaveMod
              label="TRACE ID"
              name="id"
              readOnly
              value={selectedRowEdit[0].id}
            />
            <CleaveMod
              label="MATERIAL NAME"
              name="materialID"
              placeholder="MATERIAL - SUPLIER"
              search
              fluid
              selection
              readOnly
              value={selectedRowEdit[0].materialID}
            />
            <Form.Group widths="equal">
              <CleaveMod
                label="QTY"
                name="qty"
                readOnly
                rawValue={true}
                value={selectedRowEdit[0].qty}
                options={CLEAVE_DATE_OPTIONS.numeric}
              />
              <CleaveMod
                label="EXPIRED DATE"
                name="expiredDate"
                readOnly
                value={
                  selectedRow.length &&
                  new Date(
                    Date.parse(selectedRowEdit[0].expiredDate)
                  ).toLocaleDateString(LOCALE_DATE, OPTIONS_DATE)
                }
                options={CLEAVE_DATE_OPTIONS.date}
              />
              <CleaveMod
                label="LOT NUMBER"
                name="lot"
                readOnly
                value={selectedRowEdit[0].lot}
              />
              <Form.Dropdown
                name="locationID"
                label={
                  <Label content="LOCATION" pointing="below" color="blue" />
                }
                search
                fluid
                selection
                onChange={this.handleOnChangeEdit}
                options={DinamicList(
                  locationmaps.filter(
                    x =>
                      x.traceID === "" ||
                      (selectedRow.length &&
                        x.locationID !== selectedRowEdit[0].locationID)
                  ),
                  "id",
                  x => x.name
                )}
                value={selectedRowEdit[0].locationID}
              />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="blue"
            onClick={this.handleSubmit}
            action={INCOMING.edit}
          >
            <Icon name="save" /> SAVE
          </Button>
        </Modal.Actions>
      </Modal>
    );
    const viewOutcomingModal = firstModal.active === OUTCOMING.view && (
      <Modal
        closeOnDimmerClick={false}
        closeIcon
        open={firstModal.active === OUTCOMING.view}
        onClose={this.handleModal}
      >
        <Modal.Header>
          <Segment inverted color="blue">
            <Header
              as="h2"
              icon="edit outline"
              inverted
              content="VIEW OUTCOMING"
            />
          </Segment>
        </Modal.Header>
        <Modal.Content scrolling>
          <Form>
            <Form.Group widths="equal">
              <CleaveMod
                label="ID"
                name="id"
                readOnly
                value={selectedRowEdit.id}
              />
              <CleaveMod
                label="DATE"
                name="date"
                readOnly
                value={new Date(
                  Date.parse(selectedRowEdit.date)
                ).toLocaleDateString(LOCALE_DATE, OPTIONS_DATE)}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <CleaveMod
                label="RECEIVER"
                name="receiverName"
                readOnly
                value={selectedRowEdit.receiverName}
              />
              <CleaveMod
                label="DEPARTEMENT"
                name="receiverDepartement"
                readOnly
                value={selectedRowEdit.receiverDepartement}
              />
            </Form.Group>
            {
              <Table
                headerRow={materialStockHeader}
                renderBodyRow={materialStockRowPlain}
                compact
                celled
                size="small"
                tableData={filterWithArray(
                  stoks,
                  selectedRowEdit.stokMaterialOut,
                  "id",
                  "stokID"
                )}
              />
            }
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="blue"
            onClick={this.handleSubmit}
            action={INCOMING.edit}
          >
            <Icon name="print" /> PRINT
          </Button>
        </Modal.Actions>
      </Modal>
    );
    const addMaterialOutcomingModal = secondModal.active ===
      OUTCOMING.addMaterial && (
      <Modal
        closeOnDimmerClick={false}
        size="large"
        open={secondModal.active === OUTCOMING.addMaterial}
      >
        <Modal.Header>
          <Segment inverted color="blue">
            <Header
              as="h2"
              icon="check circle"
              inverted
              content="SELECT MATERIAL"
            />
          </Segment>
        </Modal.Header>
        <Modal.Content scrolling>
          <Segment basic>
            {console.log(...selectedMaterial)}
            <MyTable
              key="stock"
              title="STOCK"
              header={materialStockHeader}
              body={materialStockRow}
              data={
                firstModal.active === OUTCOMING.edit
                  ? [
                      ...this.state.selectedMaterial2,
                      ...stoks.filter(
                        x => x.statusQCID !== "1" && !x.isDeleted && !x.isOut
                      )
                    ]
                  : stoks.filter(
                      x => x.statusQCID !== "1" && !x.isDeleted && !x.isOut
                    )
              }
              selectedRow={selectedMaterial}
              onSelectedChange={this.handleSelectedStok}
              orderBy={0}
              searchBar
              selection
            />
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="blue"
            action={OUTCOMING.closeSecondModal}
            onClick={this.handleModal}
          >
            OK
          </Button>
        </Modal.Actions>
      </Modal>
    );
    const addOutcomingModal = firstModal.active === OUTCOMING.add && (
      <Modal
        closeOnDimmerClick={false}
        closeIcon
        open={firstModal.active === OUTCOMING.add}
        onClose={this.handleModal}
      >
        <Modal.Header>
          <Segment inverted color="blue">
            <Header
              as="h2"
              icon="edit outline"
              inverted
              content="ADD OUTCOMING"
            />
          </Segment>
        </Modal.Header>
        <Modal.Content scrolling>
          <Form>
            <Form.Group widths="equal">
              <CleaveMod
                label="RECEIVER"
                name="receiverName"
                placeholder="RECEIVER NAME"
                onChange={this.handleOnChangeAddOutcoming}
              />
              <CleaveMod
                label="DEPARTEMENT"
                placeholder="DEPARTEMENT"
                name="receiverDepartement"
                onChange={this.handleOnChangeAddOutcoming}
              />
            </Form.Group>
            <Table
              headerRow={materialStockHeader}
              renderBodyRow={materialStockRow}
              compact
              celled
              size="small"
              tableData={selectedMaterial}
            />

            {selectedMaterial.length ? (
              ""
            ) : (
              <Segment basic textAlign="center">
                No material selected
              </Segment>
            )}

            <Segment basic textAlign="center">
              {addMaterialOutcomingModal}
              <MyTable.Button
                label="Add/Remove"
                action={OUTCOMING.addMaterial}
                icon="add"
                onClick={this.handleModal}
              />
            </Segment>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="blue"
            onClick={this.handleSubmit}
            disabled={
              !(checkForm(newOutcoming) && selectedMaterial.length !== 0)
            }
            action={OUTCOMING.add}
          >
            <Icon name="print" /> SAVE
          </Button>
        </Modal.Actions>
      </Modal>
    );
    const editOutcomingModal = firstModal.active === OUTCOMING.edit && (
      <Modal
        closeOnDimmerClick={false}
        closeIcon
        open={firstModal.active === OUTCOMING.edit}
        onClose={this.handleModal}
      >
        <Modal.Header>
          <Segment inverted color="blue">
            <Header
              as="h2"
              icon="edit outline"
              inverted
              content="ADD OUTCOMING"
            />
          </Segment>
        </Modal.Header>
        <Modal.Content scrolling>
          <Form>
            <CleaveMod
              label="ID"
              name="id"
              readOnly
              onChange={this.handleOnChangeEditOutcoming}
              value={newOutcoming.id}
            />
            <Form.Group widths="equal">
              <CleaveMod
                label="RECEIVER"
                name="receiverName"
                placeholder={newOutcoming.receiverName}
                onChange={this.handleOnChangeEditOutcoming}
              />
              <CleaveMod
                label="DEPARTEMENT"
                placeholder={newOutcoming.receiverDepartement}
                name="receiverDepartement"
                onChange={this.handleOnChangeEditOutcoming}
              />
            </Form.Group>
            <Table
              headerRow={materialStockHeader}
              renderBodyRow={materialStockRow}
              compact
              celled
              size="small"
              tableData={selectedMaterial}
            />

            {selectedMaterial.length ? (
              ""
            ) : (
              <Segment basic textAlign="center">
                No material selected
              </Segment>
            )}

            <Segment basic textAlign="center">
              {addMaterialOutcomingModal}
              <MyTable.Button
                label="Add/Remove"
                action={OUTCOMING.addMaterial}
                icon="add"
                onClick={this.handleModal}
              />
            </Segment>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="blue"
            onClick={this.handleSubmit}
            disabled={
              !(checkForm(newOutcoming) && selectedMaterial.length !== 0)
            }
            action={OUTCOMING.edit}
          >
            <Icon name="print" /> SAVE
          </Button>
        </Modal.Actions>
      </Modal>
    );

    //#endregion

    const panes = [
      {
        menuItem: (
          <Menu.Item
            key="stock"
            className="tabmenu"
            as={NavLink}
            to="/transaction/stok"
          >
            <Icon name="warehouse" /> STOCK
            <LabelTab count={stokAll.length} />
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane attached={false} raised piled>
            <MyTable
              key="stock"
              title="STOCK"
              header={materialStockHeader}
              body={materialStockRow}
              data={stokAll}
              selectedRow={selectedRow}
              onSelectedChange={this.handleSelectedChange}
              orderBy={0}
              searchBar
              selection
              button={stockButton}
            />
          </Tab.Pane>
        )
      },
      {
        menuItem: (
          <Menu.Item
            key="incoming"
            className="tabmenu"
            as={NavLink}
            to="/transaction/incoming"
          >
            <Icon name="arrow circle down" /> INCOMING
            <LabelTab count={incoming.length} />
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane attached={false} raised piled>
            <MyTable
              key="incoming"
              title="INCOMING MATERIAL"
              header={materialStockHeader}
              body={materialStockRow}
              data={incoming}
              selectedRow={selectedRow}
              onSelectedChange={this.handleSelectedChange}
              orderBy={0}
              orderDirection="desc"
              searchBar
              selection
              button={incomingButton}
            />
          </Tab.Pane>
        )
      },
      {
        menuItem: (
          <Menu.Item
            key="outcoming"
            className="tabmenu"
            as={NavLink}
            to="/transaction/outcoming"
          >
            <Icon name="arrow circle up" /> OUTCOMING
            <LabelTab count={outcoming.length} />
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane attached={false} raised piled>
            <MyTable
              key="outcoming"
              title="OUTCOMING"
              header={outcomingHeader}
              body={outcomingRow}
              data={outcoming}
              selectedRow={
                firstModal.active !== OUTCOMING.addMaterial && selectedRow
              }
              onSelectedChange={this.handleSelectedChange}
              orderBy={0}
              searchBar
              selection
              button={outcomingButton}
            />
          </Tab.Pane>
        )
      }
    ];

    return (
      <React.Fragment>
        {updateStatusModal}
        {addIncomingModal}
        {editIncomingModal}
        {editStokModal}
        {viewOutcomingModal}
        {addOutcomingModal}
        {editOutcomingModal}
        <Tab
          menu={{
            borderless: true,
            color: "blue",
            pointing: true,
            inverted: true
          }}
          onTabChange={this.handleTabChange}
          activeIndex={TAB.transaction[tab]}
          panes={panes}
        />
      </React.Fragment>
    );
  }
}

export default Transaction;
