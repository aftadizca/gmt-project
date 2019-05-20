import React, { Component } from "react";
import { Grid, Segment, Label } from "semantic-ui-react";
import { Line } from "react-chartjs-2";
import { TITLE, MONTH_NAME } from "../_helper/constant";
import { randomRgba } from "./../_helper/tool";

class Home extends Component {
  state = {};
  render() {
    document.title = TITLE;
    const data = {
      labels: MONTH_NAME,
      datasets: [
        {
          label: "DUS",
          data: [10000, 50000, 6565, 55545, 8000, 3, 0, 0, 0, 0, 0, 0],
          backgroundColor: "#d5000064",
          borderColor: randomRgba(1),
          borderWidth: 1
        },
        {
          label: "SEAL",
          data: [7898, 5700, 56989, 55545, 8000, 3, 0, 0, 0, 0, 0, 0],
          backgroundColor: randomRgba(0.3),
          borderColor: randomRgba(1),
          borderWidth: 1
        },

        {
          label: "CUP",
          data: [7898, 5700, 56989, 55545, 8000, 3, 0, 0, 0, 0, 0, 0],
          backgroundColor: randomRgba(0.3),
          borderColor: randomRgba(1),
          borderWidth: 1
        }
      ]
    };

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Segment raised>
              <Label as="h5" color="blue" ribbon size="huge">
                MATERIAL INCOMING
              </Label>
              <Line data={data} />
            </Segment>
            <Segment raised>
              <Label as="h5" color="blue" ribbon size="huge">
                MATERIAL STOK
              </Label>
              <Line data={data} />
            </Segment>
            <Segment raised>
              <Label as="h5" color="blue" ribbon size="huge">
                MATERIAL OUTCOMING
              </Label>
              <Line data={data} />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Home;
