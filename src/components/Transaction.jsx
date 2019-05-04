import React, { Component } from "react";
import { Tab, Icon, Label, Menu, Modal, Form, Button } from "semantic-ui-react";
import MyTable from "./../_common/MyTable";
import {
  TITLE,
  LOCALE_DATE,
  OPTIONS_DATE,
  STATUS_COLOR
} from "../_helper/constant";
import { AppContext } from "./../AppProvider";
import LabelTab from "./../_common/LabelTab";
import { NavLink } from "react-router-dom";
import QCButton from "../_common/QCButton";
import { DinamicList } from "../_helper/SelectList";
import { Toast } from "./../_helper/CostumToast";
import _ from "lodash";
import { DB } from "./../_helper/constant";

class Transaction extends Component {
  static contextType = AppContext;

  state = {
    selectedRow: [],
    selectedRowEdit: [],
    modalStatusQC: false,
    currentPageModal: 1,
    activeModal: ""
  };

  handleOnChange = (e, data) => {
    console.log("handleOnChange", { e, data });
    const selectedRowEdit = [...this.state.selectedRowEdit];
    selectedRowEdit[data.selectedrowindex] = {
      ...selectedRowEdit[data.selectedrowindex],
      [data.name]: data.value
    };
    this.setState({ selectedRowEdit });
  };

  //handle open and close modal
  handleModal = (e, data) => {
    console.log("handleModal", { e, data });
    if (data.eventPool === "Modal" && data.open) {
      this.resetModal();
      return;
    }

    switch (data.action) {
      case "STATUS_QC":
        const selectedRowEdit = _.cloneDeep(this.state.selectedRow);
        selectedRowEdit.map(x => (x.statusQCID = data.statusid));
        if (_.find(selectedRowEdit, ["locationID", 0])) {
          this.setState({ selectedRowEdit }, () =>
            this.setState({ activeModal: "UPDATE_STATUS_QC" })
          );
        } else {
          this.setState({ selectedRowEdit }, () =>
            this.handleSubmit(e, { action: "UPDATE_STATUS_QC" })
          );
        }
        break;

      case "EDIT_STOK":
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
      selectedRowEdit: []
    });
  };

  //handle submit Form
  handleSubmit = (e, data) => {
    console.log("handleSubmit", { e, data });
    const { selectedRowEdit } = this.state;
    switch (data.action) {
      case "UPDATE_STATUS_QC":
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

      default:
        break;
    }
  };

  //handle selection in Table
  handleSelectedChange = data => {
    this.setState({ selectedRow: data });
  };

  render() {
    document.title = this.props.match.params.tab.toUpperCase() + " - " + TITLE;
    const { locationmaps, stoks, useRelation } = this.context;
    const {
      activeModal,
      selectedRow,
      selectedRowEdit,
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
        table: "materials"
      },
      {
        key: 44,
        content: "SUPLIER",
        name: "materialID",
        table: "materials",
        value: "suplier"
      },
      {
        key: 3,
        content: "LOCATION",
        name: "locationID",
        table: "locationmaps"
      },
      { key: 5, content: "LOT", name: "lot" },
      { key: 6, content: "INCOMING DATE", name: "comingDate" },
      { key: 7, content: "EXP", name: "expiredDate" },
      { key: 8, content: "QTY", name: "qty" },
      { key: 4, content: "STATUS QC", name: "statusQCID" }
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
          })
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
            icon="add"
            //onClick={this.handleAddMaterialOpen}
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
            action={"EDIT_STOK"}
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
        open={activeModal === "UPDATE_STATUS_QC"}
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
                search
                fluid
                selection
                selectedrowindex={currentPageModal - 1}
                onChange={this.handleOnChange}
                options={DinamicList(
                  locationmaps.filter(x => x.traceID === ""),
                  "id",
                  "name"
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
            action="UPDATE_STATUS_QC"
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
        <Tab
          menu={{
            borderless: true,
            color: "blue",
            pointing: true,
            inverted: true
          }}
          activeIndex={TabIndex[this.props.match.params.tab]}
          panes={panes}
        />
      </React.Fragment>
    );
  }
}

export default Transaction;
