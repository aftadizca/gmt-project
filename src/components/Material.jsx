import React, { Component } from "react";
import TableHeader from "../_common/TableHeader";
import axios from "axios";
import Table from "./../_common/Table";

class Material extends Component {
  state = {
    materials: [],
    pageSize: 8
  };

  componentDidMount() {
    axios
      .get("https://localhost:44319/api/material")
      .then(({ data }) => {
        console.log(data);
        const materials = [...data];
        this.setState({ materials });
      })
      .catch(errors => {
        console.log(errors);
      });
  }

  handleButtonTableClick = movie => {
    console.log(movie);
  };

  handlePageChange = page => {
    console.log(page);
  };

  render() {
    const { materials, pageSize } = this.state;

    const header = [
      { name: "id" },
      { name: "name" },
      { name: "suplier" },
      { name: "unit" },
      {
        key: 1,
        label: "",
        content: movie => (
          <div className="btn-group">
            <button className="btn btn-sm btn-primary">
              <i className="fas fa-edit" />
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => this.handleButtonTableClick(movie)}
            >
              <i className="fas fa-trash" />
            </button>
          </div>
        )
      }
    ];

    return (
      <div className="container py-1">
        <Table
          title="MATERIAL"
          header={header}
          data={materials}
          pageSize={pageSize}
          onPageChange={this.handlePageChange}
        />
      </div>
    );
  }
}

export default Material;
