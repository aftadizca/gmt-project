import React, { Component } from "react";
import { Grid, Segment, Label } from "semantic-ui-react";
//import { Line, defaults } from "react-chartjs-2";
import { TITLE, MONTH_NAME, Line } from "../_helper/constant";
import { AppContext } from "../AppProvider";
import { gradien } from "./../_helper/tool";

class Home extends Component {
  static contextType = AppContext;
  state = {};
  render() {
    document.title = TITLE;
    const { graphs } = this.context;

    const dataInc = canvas => {
      return {
        labels: MONTH_NAME,
        datasets: [
          {
            label: "DUS (pcs)",
            data: graphs.incoming && graphs.incoming.DUS,
            borderColor: "rgb(244, 67, 54)",
            backgroundColor: gradien(canvas, 244, 67, 54)
          },
          {
            label: "SEAL (roll)",
            data: graphs.incoming && graphs.incoming.SEAL,
            borderColor: "rgba(33,150,243)",
            backgroundColor: gradien(canvas, 33, 150, 243)
          },
          {
            label: "CUP (pcs)",
            data: graphs.incoming && graphs.incoming.CUP,
            borderColor: "rgba(0,150,136)",
            backgroundColor: gradien(canvas, 0, 150, 136)
          },
          {
            label: "SEDOTAN (pack)",
            data: graphs.incoming && graphs.incoming.SEDOTAN,
            borderColor: "rgba(255,143,0,1.000)",
            backgroundColor: gradien(canvas, 255, 143, 0)
          },
          {
            label: "LAKBAN (roll)",
            data: graphs.incoming && graphs.incoming.LAKBAN,
            borderColor: "rgba(216,67,21,1.000)",
            backgroundColor: gradien(canvas, 216, 67, 21)
          }
        ]
      };
    };

    const dataOut = canvas => {
      return {
        labels: MONTH_NAME,
        datasets: [
          {
            label: "DUS (pcs)",
            data: graphs.outcoming && graphs.outcoming.DUS,
            borderColor: "rgba(244,67,54)",
            backgroundColor: gradien(canvas, 244, 67, 54)
          },
          {
            label: "SEAL (roll)",
            data: graphs.outcoming && graphs.outcoming.SEAL,
            borderColor: "rgba(33,150,243)",
            backgroundColor: gradien(canvas, 33, 150, 243)
          },

          {
            label: "CUP (pcs)",
            data: graphs.outcoming && graphs.outcoming.CUP,
            borderColor: "rgba(0,150,136)",
            backgroundColor: gradien(canvas, 0, 150, 136)
          },
          {
            label: "SEDOTAN (pack)",
            data: graphs.outcoming && graphs.outcoming.SEDOTAN,
            borderColor: "rgba(255,143,0,1.000)",
            backgroundColor: gradien(canvas, 255, 143, 0)
          },
          {
            label: "LAKBAN (roll)",
            data: graphs.outcoming && graphs.outcoming.LAKBAN,
            borderColor: "rgba(216,67,21,1.000)",
            backgroundColor: gradien(canvas, 216, 67, 21)
          }
        ]
      };
    };

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Segment raised>
              <Label as="h5" color="blue" ribbon size="huge">
                MATERIAL INCOMING
              </Label>
              <Line data={dataInc} />
            </Segment>
            <Segment raised>
              <Label as="h5" color="blue" ribbon size="huge">
                MATERIAL OUTCOMING
              </Label>
              <Line data={dataOut} />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Home;
