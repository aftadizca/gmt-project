import React, { Component } from "react";
import { Document, Page, Text, View, BlobProvider } from "@react-pdf/renderer";
import { Button, Modal } from "semantic-ui-react";
import { PDF_STYLE } from "../_helper/constant";
import _ from "lodash";

const testArr = _.range(1, 27, 1);

const MyDocument = (
  <Document>
    <Page size="A4" orientation="landscape" style={PDF_STYLE.page}>
      <Text style={PDF_STYLE.title}>INI JUDUL TABLE</Text>
      <View style={PDF_STYLE.container}>
        <View style={PDF_STYLE.column}>
          <Text style={PDF_STYLE.header}>Header</Text>
          <Text style={PDF_STYLE.cell}>CELLLLLLLLLLLLL</Text>
          <Text style={PDF_STYLE.cell}>CELLLLLLLLLLLLL</Text>
          <Text style={PDF_STYLE.cell}>CELLLLLLLLLLLLL</Text>
          <Text style={PDF_STYLE.cell}>CELLLLLLLLLLLLLd</Text>
        </View>
        <View style={PDF_STYLE.column}>
          <Text style={PDF_STYLE.header}>Header</Text>
          <Text style={PDF_STYLE.cell}>CELLLLLLLLLLLLL</Text>
          <Text style={PDF_STYLE.cell}>CELLLLLLLLLLLLLdfdfdf</Text>
          <Text style={PDF_STYLE.cell}>CELLLLLLLLLLLLL</Text>
          <Text style={PDF_STYLE.cell}>CELLLLLLLLLLLLL</Text>
        </View>
        <View style={PDF_STYLE.column}>
          <Text style={PDF_STYLE.header}>Header</Text>
          <Text style={PDF_STYLE.cell}>CELLLLLLLLLLLLL</Text>
          <Text style={PDF_STYLE.cell}>CELLLLLLLLLLLLLdfdf</Text>
          <Text style={PDF_STYLE.cell}>CELLLLLLLLLLLLL</Text>
          <Text style={PDF_STYLE.cell}>CELLLLLLLLLLLLL</Text>
        </View>
      </View>
      <Text style={PDF_STYLE.pageCount}>1/2</Text>
    </Page>
  </Document>
);

class Print extends Component {
  state = {};

  redirect = url => {
    return window.open(url);
  };

  render() {
    return (
      <div>
        <BlobProvider document={MyDocument}>
          {data => {
            console.log({ data });
            return (
              <Button onClick={() => this.redirect(data.url)}>DOWNLOAD</Button>
            );
          }}
        </BlobProvider>
      </div>
    );
  }
}

export default Print;
