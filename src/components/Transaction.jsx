import React, { Component } from "react";
import {
  Tab,
  Icon,
  Label,
  Menu,
  Modal,
  Form,
  Message,
  Button
} from "semantic-ui-react";
import MyTable from "./../_common/Table";
import { TITLE } from "../_helper/constant";
import { AppContext } from "./../AppProvider";
import { getById } from "../_helper/tool";
import LabelTab from "./../_common/LabelTab";
import { NavLink } from "react-router-dom";
import StatusButton from "../_common/StatusButton";
import { Enum } from "linq";
import { DinamicList } from "../_helper/SelectList";

class Transaction extends Component {
  static contextType = AppContext;

  state = {
    selectedStok: [],
    modalStatusQC: false,
    selectedStok: {}
  };

  componentDidMount() {
    console.log("Transaction DidMounted");
  }

  handleUpdateStatusQC = (qc, data) => {
    const x = { ...data };
    x.statusQCID = qc;
    this.setState({ selectedStok: x });
    this.setState({ modalStatusQC: true });
  };

  modalStatusQCClose = () => {
    this.setState({ modalStatusQC: false });
  };

  render() {
    console.log("Transaction render");
    document.title = this.props.match.params.tab.toUpperCase() + " - " + TITLE;
    const { materials, locationmaps, statusQCs, stoks } = this.context;
    const { modalStatusQC, selectedStok } = this.state;

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
          content: new Date(Date.parse(data.comingDate)).toLocaleDateString()
        },
        {
          key: `exp-${i}`,
          content: new Date(Date.parse(data.expiredDate)).toLocaleDateString()
        },
        data.qty,
        {
          key: `statusQC-${i}`,
          content: (
            <StatusButton
              button={this.context.statusQCs}
              disabled={modalStatusQC}
              label={getById(statusQCs, data.statusQCID, "name")}
              onClick={qc => this.handleUpdateStatusQC(qc, data)}
            />
          )
        }
      ]
    });

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
              headerRow={materialStockHeader}
              renderBodyRow={materialStockRow}
              data={stokAll}
              orderBy="materialID"
              orderDirection="asc"
              actionBar={true}
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
              headerRow={materialStockHeader}
              renderBodyRow={materialStockRow}
              data={incoming}
              orderBy="materialID"
              orderDirection="asc"
              actionBar={true}
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
        <Modal
          closeOnDimmerClick={false}
          closeIcon
          size="small"
          open={modalStatusQC}
          onClose={this.modalStatusQCClose}
        >
          <Modal.Header>UPDATE STATUS QC</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input
                label="Material Name"
                name="name"
                readOnly
                value={selectedStok.id}
                placeholder="Material ID"
              />
              <Form.Input
                label="Material Name"
                name="name"
                readOnly
                value={getById(materials, selectedStok.materialID, "name")}
                placeholder="Material ID"
              />
              <Form.Input
                label="Material Name"
                name="name"
                readOnly
                value={getById(statusQCs, selectedStok.statusQCID, "name")}
                placeholder="Material ID"
              />
              <Form.Select
                name="type"
                label="Type"
                options={DinamicList(
                  locationmaps.filter(x => x.traceID === ""),
                  "id",
                  "location"
                )}
                value={selectedStok.locationID}
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="blue" onClick={this.handleSaveEditMaterial}>
              <Icon name="save" /> SAVE
            </Button>
          </Modal.Actions>
        </Modal>
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
