import React, { Component } from "react";
import { Segment, Header, Table, Grid } from "semantic-ui-react";
import { AppContext } from "../AppProvider";
import { DB, LOCALE_DATE, OPTIONS_DATE } from "../_helper/constant";

class Print extends Component {
  static contextType = AppContext;
  state = {};

  render() {
    const { state } = this.props.location;
    const { useRelation } = this.context;
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
          content: useRelation(DB.locationmaps, data.locationID, "name") || "-"
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
    return (
      <React.Fragment>
        <Segment textAlign="center">
          <Header as="h2" content={state.title} />
        </Segment>
        <Segment>
          <Grid columns={4}>
            <Grid.Row>
              <Grid.Column>ID</Grid.Column>
              <Grid.Column>{state.id}</Grid.Column>
              <Grid.Column>DATE</Grid.Column>
              <Grid.Column>
                {new Date(Date.parse(state.date)).toLocaleDateString(
                  LOCALE_DATE,
                  OPTIONS_DATE
                )}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>RECEIVER</Grid.Column>
              <Grid.Column>{state.receiverName}</Grid.Column>
              <Grid.Column>DEPARTEMENT</Grid.Column>
              <Grid.Column>{state.receiverDepartement}</Grid.Column>
            </Grid.Row>
          </Grid>
          <Table
            headerRow={materialStockHeader}
            renderBodyRow={materialStockRow}
            compact
            stackable
            celled
            size="small"
            tableData={state.data}
          />
        </Segment>
      </React.Fragment>
    );
  }
}

export default Print;
