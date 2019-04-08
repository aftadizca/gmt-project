import React from "react";
import { Table } from "semantic-ui-react";

const TableHeader = ({ data }) => {
  return (
    <Table.Header>
      <Table.Row>
        {data.map(header => (
          <Table.HeaderCell
            className="text-uppercase text-center bg-primary  text-white"
            key={header.key || header.name}
            scope="col"
          >
            {header.label || header.name}
          </Table.HeaderCell>
        ))}
      </Table.Row>
    </Table.Header>
  );
};

export default TableHeader;
