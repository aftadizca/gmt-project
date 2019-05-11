import React, { Component } from "react";
import { Tab, Icon, Label, Menu, Modal, Form, Button } from "semantic-ui-react";
import MyTable from "./../_common/MyTable";
import {
  TITLE,
  LOCALE_DATE,
  OPTIONS_DATE,
  STATUS_COLOR,
  INCOMING,
  STOK
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

  handleOnChangeQC = (e, data) => {
    console.log("handleOnChangeQC", { e, data });
    const selectedRowEdit = [...this.state.selectedRowEdit];
    selectedRowEdit[data.selectedrowindex] = {
      ...selectedRowEdit[data.selectedrowindex],
      [data.name]: data.value
    };
    this.setState({ selectedRowEdit });
  };

  handleOnChangeAdd = _.debounce(
    (e, data) => {
      console.log("handleOnChangeAdd", { e, data });
      let newStok = { ...this.state.newStok, [data.name]: data.value };
      this.setState({ newStok });
    },
    500,
    { trailing: true }
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
        const selectedRowEdit = _.cloneDeep(this.state.selectedRow);
        selectedRowEdit.map(x => (x.statusQCID = data.statusid));
        if (_.find(selectedRowEdit, ["locationID", 0])) {
          this.setState({ selectedRowEdit }, () =>
            this.setState({ activeModal: STOK.updateQC })
          );
        } else {
          this.setState({ selectedRowEdit }, () =>
            this.handleSubmit(e, { action: STOK.updateQC })
          );
        }
        break;

      case INCOMING.add:
        this.setState({ activeModal: INCOMING.add });
        break;

      default:
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
          undefined,
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
          expiredDate: new Date(this.state.newStok.expiredDate).toJSON()
        };
        this.context.postAPI("stok", newStok, () => this.resetModal());
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

  render() {
    document.title = this.props.match.params.tab.toUpperCase() + " - " + TITLE;
    const { locationmaps, stoks, useRelation } = this.context;
    const {
      activeModal,
      selectedRow,
      selectedRowEdit,
      newStok,
      currentPageModal
    } = this.state;

    const incoming = stoks.filter(x => x.statusQCID === 1);
    const stokAll = stoks.filter(x => x.statusQCID > 1 && x.qty > 0);

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
        value: "suplier"
      },
      {
        key: 3,
        content: "LOCATION",
        name: "locationID",
        table: DB.locationmaps,
        skip: true
      },
      { key: 5, content: "LOT", name: "lot" },
      { key: 6, content: "INCOMING DATE", name: "comingDate" },
      { key: 7, content: "EXP", name: "expiredDate" },
      { key: 8, content: "QTY", name: "qty" },
      { key: 4, content: "STATUS QC", name: "statusQCID", skip: true }
    ];

    const materialStockRow = (data, i) => ({
      key: `row-${i}`,
      cells: [
        data.id,
        {
          key: `material-${i}`,
          content: useRelation({
            db: DB.materials,
            key: data.materialID,
            value: "name"
          })
        },
        {
          key: `suplier-${i}`,
          content: useRelation({
            db: DB.materials,
            key: data.materialID,
            value: "suplier"
          })
        },
        {
          key: `location-${i}`,
          content: useRelation({
            db: DB.locationmaps,
            key: data.locationID,
            value: "name"
          }) || <Icon name="question" color="red" size="small" />
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
              {useRelation({
                db: DB.statusQCs,
                key: data.statusQCID,
                value: "name"
              })}
            </Label>
          )
        }
      ]
    });

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
            disabled={!(selectedRow.length === 1)}
            //onClick={this.handleAddMaterialOpen}
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
            <Form.Input
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
                useRelation({
                  db: DB.materials,
                  key: selectedRowEdit[currentPageModal - 1].materialID,
                  value: "name"
                })
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
                  useRelation({
                    db: DB.statusQCs,
                    key: selectedRowEdit[currentPageModal - 1].statusQCID,
                    value: "name"
                  })
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
            disabled={_.some(selectedRowEdit, ["locationID", 0])}
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
              placeholder="MM-DD-YYYY"
              name="expiredDate"
              onChange={this.handleOnChangeAdd}
              options={{
                date: true,
                delimiter: "/",
                datePattern: ["m", "d", "Y"]
              }}
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
                options={{
                  numeral: true,
                  numeralThousandsGroupStyle: "thousand",
                  rawValueTrimPrefix: true
                }}
              />
              <CleaveMod
                label="QTY PER PALLET"
                name="pallet"
                placeholder="QTY PER PALLET"
                rawValue={true}
                onChange={this.handleOnChangeAdd}
                options={{
                  numeral: true,
                  numeralThousandsGroupStyle: "thousand",
                  rawValueTrimPrefix: true
                }}
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

    const TabIndex = {
      stok: 0,
      incoming: 1,
      outcoming: 2
    };

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
        <Tab
          menu={{
            borderless: true,
            color: "blue",
            pointing: true,
            inverted: true
          }}
          onTabChange={this.handleTabChange}
          activeIndex={TabIndex[this.props.match.params.tab]}
          panes={panes}
        />
      </React.Fragment>
    );
  }
}

export default Transaction;
