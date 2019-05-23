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
            borderColor: "rgba(0,150,136,1.000)",
            backgroundColor: gradien(canvas, 0, 150, 136)
          }
        ]
      };
    };

    const dataOut = canvas => {
      return {
        labels: MONTH_NAME,
        datasets: [
          {
            label: "DUS",
            data: graphs.outcoming && graphs.outcoming.DUS,
            borderColor: "rgba(244,67,54,1.000)",
            backgroundColor: gradien(canvas, 244, 67, 54)
          },
          {
            label: "SEAL",
            data: graphs.outcoming && graphs.outcoming.DUS,
            borderColor: "rgba(33,150,243,1.000)",
            backgroundColor: gradien(canvas, 33, 150, 243)
          },

          {
            label: "CUP",
            data: graphs.outcoming && graphs.outcoming.DUS,
            borderColor: "rgba(0,150,136,1.000)",
            backgroundColor: gradien(canvas, 0, 150, 136)
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
