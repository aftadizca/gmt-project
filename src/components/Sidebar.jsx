import React from "react";
import { Menu } from "semantic-ui-react";
// import "../components/Sidebar.css";

const SideBar = ({ children, onMouseEnter, onMouseLeave }) => {
  return (
    <Menu icon="labeled" fixed="left" color="blue" inverted vertical>
      <div style={{ marginTop: 100 }} />
      {children}
    </Menu>
  );
};

export default SideBar;
