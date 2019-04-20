import React, { Component } from "react";
import { Tab, Icon, Label, Menu, Checkbox } from "semantic-ui-react";
import MyTable from "./../_common/Table";
import { TITLE } from "../_helper/constant";
import { AppContext } from "./../AppProvider";
import { getById } from "../_helper/tool";
import LabelTab from "./../_common/LabelTab";
import { NavLink } from "react-router-dom";

class Transaction extends Component {
  static contextType = AppContext;

  state = {
    selectedStock: []
  };

  componentDidMount() {
    console.log("Transaction DidMounted");
  }

  handleSelectRow = data => {
    data.active = data.active ? !data.active : true;
    this.context.handleUpdate("stoks", data);
  };

  render() {
    console.log("Transaction render");
    document.title = this.props.match.params.tab.toUpperCase() + " - " + TITLE;
    const { materials, locationmaps, statusQCs, stoks } = this.context;

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
      active: data.active,
      onClick: () => this.handleSelectRow(data),
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
          content: getById(statusQCs, data.statusQCID, "name")
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
    );
  }
}

export default Transaction;
