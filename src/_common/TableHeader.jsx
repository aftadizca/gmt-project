import React from "react";

const TableHeader = ({ data }) => {
  return (
    <thead>
      <tr>
        {data.map(header => (
          <th
            className="text-uppercase text-center bg-primary  text-white"
            key={header.key || header.name}
            scope="col"
          >
            {header.label || header.name}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
