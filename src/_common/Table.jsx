import React, { Component } from "react";
import TableHeader from "./TableHeader";
import _ from "lodash";

class Table extends Component {
  render() {
    const { header, data, title, pageSize, onPageChange } = this.props;
    const pageNumber = _.range(1, pageSize + 1);

    return (
      <React.Fragment>
        <div className="card">
          <div className="card-body bg-primary">
            <h5 className="text-white">{title}</h5>
          </div>
        </div>
        <div className="card border-primary">
          <div className="card-body">
            <table className="table table-striped table-hover">
              <TableHeader data={header} />
              <tbody>
                {data.map(rows => (
                  <tr key={rows.id}>
                    {header.map((label, i) => (
                      <td className="text-center" key={i}>
                        {rows[label.name] || label.content(rows)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-footer bg-primary">
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                {pageNumber.map(x => (
                  <li
                    key={x}
                    className="page-item"
                    onClick={() => onPageChange(x)}
                  >
                    <a
                      key={x}
                      className="page-link"
                      style={{ cursor: "pointer" }}
                    >
                      {x}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Table;
