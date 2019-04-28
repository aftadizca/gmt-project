import React, { Component } from "react";
import { Tab, Icon, Label, Menu, Modal, Form, Button } from "semantic-ui-react";
import MyTable from "./../_common/MyTable";
import { TITLE, LOCALE_DATE, OPTIONS_DATE } from "../_helper/constant";
import { AppContext } from "./../AppProvider";
import { getById } from "../_helper/tool";
import LabelTab from "./../_common/LabelTab";
import { NavLink } from "react-router-dom";
import QCButton from "../_common/QCButton";
import { DinamicList } from "../_helper/SelectList";
import { Toast } from "./../_helper/CostumToast";

class Transaction extends Component {
  static contextType = AppContext;

  state = {
    selectedStok: {},
    selectedRow: [],
    modalStatusQC: false
  };

  componentDidMount() {
    console.log("Transaction DidMounted");
  }

  handleUpdateStatusQC = (qc, data) => {
    const x = { ...data };
    console.log(qc, data);
    x.statusQCID = qc;
    this.setState({ selectedStok: x });
    if (!x.locationID) {
      this.setState({ modalStatusQC: true });
    } else {
      setTimeout(() => {
        this.handleSubmit(false, "");
      }, 500);
    }
  };

  handleModalStatusQCClose = () => {
    this.setState({ modalStatusQC: false });
  };

  handleOnChange = (e, data) => {
    this.setState({
      selectedStok: { ...this.state.selectedStok, [data.name]: data.value }
    });
  };

  handleSubmit = (e, data) => {
    const { selectedStok } = this.state;
    if (data.name === "statusqc") {
      this.context.putAPI(
        "stok",
        selectedStok.id,
        selectedStok,
        () => {
          this.handleModalStatusQCClose();
          this.setState({ selectedStok: {} });
        },
        response => Toast(response.data, "error").fire()
      );
    } else {
      this.context.putAPI(
        "stok",
        selectedStok.id,
        selectedStok,
        false,
        response => Toast(response.data, "error").fire()
      );
    }
  };

  handleSelectedChange = data => {
    this.setState({ selectedRow: data });
  };

  render() {
    document.title = this.props.match.params.tab.toUpperCase() + " - " + TITLE;
    const { materials, locationmaps, statusQCs, stoks } = this.context;
    const { modalStatusQC, selectedStok, selectedRow } = this.state;

    const incoming = stoks.filter(x => x.statusQCID === 1);
    const stokAll = stoks.filter(x => x.statusQCID > 1 && x.qty > 0);

    const materialStockHeader = [
      { key: 1, content: "TRACE ID", name: "id" },
      { key: 2, content: "MATERIAL NAME", name: "materialID" },
      { key: 3, content: "LOCATION", name: "locationID" },
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
          content: getById(materials, data.materialID, "name")
        },
        {
          key: `location-${i}`,
          content: getById(locationmaps, data.locationID, "location")
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
            <QCButton
              button={this.context.statusQCs}
              disabled={modalStatusQC}
              label={getById(statusQCs, data.statusQCID, "name")}
              onClick={qc => this.handleUpdateStatusQC(qc, data)}
            />
          )
        }
      ]
    });

    const incomingButton = (
      <Button.Group>
        <MyTable.Button
          title="Refresh"
          icon="refresh"
          onClick={() => this.context.getAPI(["stok"])}
        />
        <MyTable.Button
          title="Add"
          icon="add"
          //onClick={this.handleAddMaterialOpen}
        />
        <MyTable.Button
          title="Edit"
          icon="edit"
          disabled={!(selectedRow.length === 1)}
          //onClick={this.handleAddMaterialOpen}
        />
      </Button.Group>
    );
    const stockButton = (
      <Button.Group>
        <MyTable.Button
          title="Refresh"
          icon="refresh"
          onClick={() => this.context.getAPI(["stok"])}
        />
        <MyTable.Button
          title="Edit"
          icon="edit"
          disabled={!(selectedRow.length === 1)}
          //onClick={this.handleAddMaterialOpen}
        />
      </Button.Group>
    );

    const updateStatusModal = (
      <Modal
        closeOnDimmerClick={false}
        closeIcon
        size="small"
        open={modalStatusQC}
        onClose={this.handleModalStatusQCClose}
      >
        <Modal.Header>UPDATE STATUS QC</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              label="TRACE ID"
              name="id"
              readOnly
              value={selectedStok.id}
            />
            <Form.Input
              label="MATERIAL NAME"
              name="name"
              readOnly
              value={getById(materials, selectedStok.materialID, "name")}
            />
            <Form.Group widths="equal">
              <Form.Input
                label="STATUS QC"
                name="statusQCID"
                readOnly
                color="blue"
                inverted
                fluid
                value={getById(statusQCs, selectedStok.statusQCID, "name")}
              />
              <Form.Dropdown
                name="locationID"
                label="LOCATION"
                search
                fluid
                selection
                onChange={this.handleOnChange}
                options={DinamicList(
                  locationmaps.filter(x => x.traceID === ""),
                  "id",
                  "location"
                )}
                value={selectedStok.locationID}
              />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="blue" onClick={this.handleSubmit} name="statusqc">
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
