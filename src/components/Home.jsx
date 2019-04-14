import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import { Line } from "react-chartjs-2";

class Home extends Component {
  state = {};
  render() {
    document.tile = "HOME";
    const data = {
      labels: [
        "January",
        "February",
        "Maret",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      datasets: [
        {
          label: "MATERIAL INCOMING",
          data: [10000, 50000, 6565, 55545, 8000, 3, 0, 0, 0, 0, 0, 0],
          backgroundColor: ["rgba(33, 133, 208, 0.5)"],
          borderColor: [
            "rgba(0, 92, 240, 1)",
            "rgba(0, 92, 240, 1)",
            "rgba(0, 92, 240, 1)",
            "rgba(0, 92, 240, 1)",
            "rgba(0, 92, 240, 1)",
            "rgba(0, 92, 240, 1)",
            "rgba(0, 92, 240, 1)",
            "rgba(0, 92, 240, 1)",
            "rgba(0, 92, 240, 1)",
            "rgba(0, 92, 240, 1)",
            "rgba(0, 92, 240, 1)",
            "rgba(0, 92, 240, 1)"
          ],
          borderWidth: 3
        },
        {
          label: "MATERIAL OUTCOMING",
          data: [7898, 5700, 56989, 55545, 8000, 3, 0, 0, 0, 0, 0, 0],
          backgroundColor: ["rgba(255, 112, 112, 0.4)"],
          borderColor: [
            "rgba(255, 0, 0, 1)",
            "rgba(255, 0, 0, 1)",
            "rgba(255, 0, 0, 1)",
            "rgba(255, 0, 0, 1)",
            "rgba(255, 0, 0, 1)",
            "rgba(255, 0, 0, 1)",
            "rgba(255, 0, 0, 1)",
            "rgba(255, 0, 0, 1)",
            "rgba(255, 0, 0, 1)",
            "rgba(255, 0, 0, 1)",
            "rgba(255, 0, 0, 1)",
            "rgba(255, 0, 0, 1)"
          ],
          borderWidth: 3
        }
      ]
    };

    return (
      <Grid>
        <Grid.Row>
          <Line data={data} />
        </Grid.Row>
      </Grid>
    );
  }
}

export default Home;
