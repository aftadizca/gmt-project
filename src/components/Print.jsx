import React, { Component } from "react";
import { Document, Page, Text, View, BlobProvider } from "@react-pdf/renderer";
import { Button, Icon } from "semantic-ui-react";
import { PDF_STYLE, LOCALE_DATE, OPTIONS_DATE } from "../_helper/constant";
import { AppContext } from "../AppProvider";

class Print extends Component {
  static contextType = AppContext;
  state = {};

  redirect = url => {
    return window.open(url);
  };

  render() {
    const { detail, data, header } = this.props;
    const MyDocument = (
      <Document>
        <Page size="A4" orientation="landscape" style={PDF_STYLE.page}>
          <Text style={PDF_STYLE.title}>OUTCOMING TRANSACTION</Text>
          <View style={PDF_STYLE.container}>
            <View style={PDF_STYLE.column}>
              <Text style={PDF_STYLE.label}>ID</Text>
              <Text style={PDF_STYLE.label}>RECEIVER</Text>
            </View>
            <View style={PDF_STYLE.column}>
              <Text style={PDF_STYLE.labelValue}>{detail.id}</Text>
              <Text style={PDF_STYLE.labelValue}>{detail.receiverName}</Text>
            </View>
            <View style={PDF_STYLE.column}>
              <Text style={PDF_STYLE.label}>DATE</Text>
              <Text style={PDF_STYLE.label}>DEPARTEMENT</Text>
            </View>
            <View style={PDF_STYLE.column}>
              <Text style={PDF_STYLE.labelValue}>
                {new Date(Date.parse(detail.date)).toLocaleDateString(
                  LOCALE_DATE,
                  OPTIONS_DATE
                )}
              </Text>
              <Text style={PDF_STYLE.labelValue}>
                {detail.receiverDepartement}
              </Text>
            </View>
          </View>
          <View style={PDF_STYLE.container}>
            {header.map((x, i) => (
              <View key={"v" + i} style={PDF_STYLE.column}>
                <Text key={"header" + i} style={PDF_STYLE.header}>
                  {header[i].content}
                </Text>
                {data.map((y, j) => (
                  <Text key={"text-" + i + "-" + j} style={PDF_STYLE.cell}>
                    {y[i].content}
                  </Text>
                ))}
              </View>
            ))}
          </View>
          <Text style={PDF_STYLE.pageCount}>1/2</Text>
        </Page>
      </Document>
    );
    return (
      <div>
        <BlobProvider document={MyDocument}>
          {data => {
            return (
              <Button color="blue" onClick={() => this.redirect(data.url)}>
                <Icon name="print" /> PRINT
              </Button>
            );
          }}
        </BlobProvider>
      </div>
    );
  }
}

export default Print;
