import React, { Component } from "react";
import { Tab, Icon, Label, Menu, Modal, Form, Button } from "semantic-ui-react";
import MyTable from "./../_common/MyTable";
import {
  TITLE,
  LOCALE_DATE,
  OPTIONS_DATE,
  STATUS_COLOR,
  INCOMING,
  STOK,
  CLEAVE_DATE_OPTIONS,
  TAB
} from "../_helper/constant";
import { AppContext } from "./../AppProvider";
import LabelTab from "./../_common/LabelTab";
import { NavLink } from "react-router-dom";
import QCButton from "../_common/QCButton";
import { DinamicList } from "../_helper/SelectList";
import { Toast } from "./../_helper/CostumToast";
import _ from "lodash";
import { DB } from "./../_helper/constant";
import CleaveMod from "./../_common/CleaveMod";
import { checkForm } from "../_helper/tool";

class Transaction extends Component {
  static contextType = AppContext;

  state = {
    selectedRow: [],
    selectedRowEdit: [],
    modalStatusQC: false,
    currentPageModal: 1,
    activeModal: "",
    modalError: "",
    newStok: {
      expiredDate: "",
      lot: "",
      materialID: "",
      qty: null,
      pallet: null
    }
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

  //handle open and close modal
  handleModal = (e, data) => {
    console.log("handleModal", { e, data });
    if (data.eventPool === "Modal" && data.open) {
      this.resetModal();
      return;
    }

    switch (data.action) {
      case STOK.updateQC:
        const selectedRowEdit = this.state.selectedRow.map(x => {
          return { ...x, statusQCID: data.statusid };
        });
        //jika lokasi kosong tampilkan modal
        if (_.find(selectedRowEdit, ["locationID", "0"])) {
          this.setState({ selectedRowEdit }, () =>
            this.setState({ activeModal: STOK.updateQC })
          );
          //jika ada lokasi do update StatusQC
        } else {
          this.setState({ selectedRowEdit }, () =>
            this.handleSubmit(e, { action: STOK.updateQC })
          );
        }
        break;

      default:
        this.setState({ activeModal: data.action });
        this.setState({ selectedRowEdit: [...this.state.selectedRow] });
        break;
    }
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
      activeModal: "",
      currentPageModal: 1,
      selectedRowEdit: [],
      newStok: {
        expiredDate: "",
        lot: "",
        materialID: "",
        qty: null,
        pallet: null
      }
    });
  };

  //handle submit Form
  handleSubmit = (e, data) => {
    console.log("handleSubmit", { e, data });
    const { selectedRowEdit } = this.state;
    switch (data.action) {
      case STOK.updateQC:
        this.context.putAPI(
          "stok",
          selectedRowEdit,
          () => {
            this.resetModal();
            this.setState({ selectedRow: [] });
            this.context.locationMap();
          },
          response => Toast(response.data, "error").fire()
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
          () => this.resetModal(),
          () => Toast("Opps.. Something wrong.. Try Again!", "error").fire()
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
          },
          response => Toast(response.data, "error").fire()
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

  handleTabChange = () => {
    this.setState({ selectedRow: [] });
  };

  //#endregion

  render() {
    document.title = this.props.match.params.tab.toUpperCase() + " - " + TITLE;

    //#region DESTUCTURING STATE & PROPS
    const { locationmaps, stoks, useRelation } = this.context;
    const {
      activeModal,
      selectedRow,
      selectedRowEdit,
      newStok,
      currentPageModal
    } = this.state;
    //#endregion

    const incoming = stoks.filter(
      x => x.statusQCID === "1" && x.isDeleted === false
    );
    const stokAll = stoks.filter(
      x => x.statusQCID !== "1" && x.qty > 0 && x.isDeleted === false
    );

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
    //#endregion
    //#region MODAL
    const updateStatusModal = (
      <Modal
        closeOnDimmerClick={false}
        closeIcon
        size="small"
        open={activeModal === STOK.updateQC}
        onClose={this.handleModal}
      >
        <Modal.Header>
          UPDATE STATUS QC{" "}
          <Label color="blue" horizontal size="large">
            {currentPageModal}/{selectedRow.length}
          </Label>
        </Modal.Header>
        <Modal.Content>
          <Form>
            <CleaveMod
              label="TRACE ID"
              name="id"
              readOnly
              value={
                selectedRowEdit.length &&
                selectedRowEdit[currentPageModal - 1].id
              }
            />
            <Form.Input
              label="MATERIAL NAME"
              name="name"
              readOnly
              value={
                selectedRowEdit.length &&
                useRelation(
                  DB.materials,
                  selectedRowEdit[currentPageModal - 1].materialID,
                  "name"
                )
              }
            />
            <Form.Group widths="equal">
              <Form.Input
                label="STATUS QC"
                name="statusQCID"
                readOnly
                color="blue"
                inverted
                fluid
                value={
                  selectedRowEdit.length &&
                  useRelation(
                    DB.statusQCs,
                    selectedRowEdit[currentPageModal - 1].statusQCID,
                    "name"
                  )
                }
              />
              <Form.Dropdown
                name="locationID"
                label="LOCATION"
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
                value={
                  selectedRowEdit.length &&
                  selectedRowEdit[currentPageModal - 1].locationID
                }
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
    const addIncomingModal = (
      <Modal
        closeOnDimmerClick={false}
        closeIcon
        size="small"
        open={activeModal === INCOMING.add}
        onClose={this.handleModal}
      >
        <Modal.Header>ADD STOCK</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Dropdown
              label="MATERIAL NAME"
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
    const editIncomingModal = (
      <Modal
        closeOnDimmerClick={false}
        closeIcon
        size="small"
        open={activeModal === INCOMING.edit}
        onClose={this.handleModal}
      >
        <Modal.Header>EDIT INCOMING MATERIAL</Modal.Header>
        <Modal.Content>
          <Form>
            <CleaveMod
              label="TRACE ID"
              name="id"
              readOnly
              value={selectedRow.length && selectedRow[0].id}
            />
            <Form.Dropdown
              label="MATERIAL NAME"
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
                label="LOCATION"
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
    const editStokModal = (
      <Modal
        closeOnDimmerClick={false}
        closeIcon
        size="small"
        open={activeModal === STOK.edit}
        onClose={this.handleModal}
      >
        <Modal.Header>EDIT STOK MATERIAL</Modal.Header>
        <Modal.Content>
          <Form>
            <CleaveMod
              label="TRACE ID"
              name="id"
              readOnly
              value={selectedRow.length && selectedRow[0].id}
            />
            <CleaveMod
              label="MATERIAL NAME"
              name="materialID"
              placeholder="MATERIAL - SUPLIER"
              search
              fluid
              selection
              readOnly
              value={selectedRowEdit.length && selectedRowEdit[0].materialID}
            />
            <Form.Group widths="equal">
              <CleaveMod
                label="QTY"
                name="qty"
                readOnly
                rawValue={true}
                value={selectedRow.length && selectedRow[0].qty}
                options={CLEAVE_DATE_OPTIONS.numeric}
              />
              <CleaveMod
                label="EXPIRED DATE"
                name="expiredDate"
                readOnly
                value={
                  selectedRowEdit.length &&
                  new Date(
                    Date.parse(selectedRow[0].expiredDate)
                  ).toLocaleDateString(LOCALE_DATE, OPTIONS_DATE)
                }
                options={CLEAVE_DATE_OPTIONS.date}
              />
              <CleaveMod
                label="LOT NUMBER"
                name="lot"
                readOnly
                value={selectedRow.length && selectedRow[0].lot}
              />
              <Form.Dropdown
                name="locationID"
                label="LOCATION"
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
                value={selectedRow.length && selectedRow[0].locationID}
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
            <Label color="green" pointing="left">
              19
            </Label>
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane attached={false} raised piled>
            Tab 3 Content
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
        <Tab
          menu={{
            borderless: true,
            color: "blue",
            pointing: true,
            inverted: true
          }}
          onTabChange={this.handleTabChange}
          activeIndex={TAB.transaction[this.props.match.params.tab]}
          panes={panes}
        />
      </React.Fragment>
    );
  }
}

export default Transaction;
