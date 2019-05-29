import React from "react";
import { Menu } from "semantic-ui-react";
import SideBarItem from "./../_common/SideBarItem";

const MySideBar = ({ children }) => {
  return (
    <Menu
      icon="labeled"
      color="blue"
      inverted
      fixed="top"
      size="tiny"
      secondary
      pointing
    >
      <div style={{ paddingLeft: "3rem" }} />
      <SideBarItem path="/home" icon="home" text="Home" />
      <SideBarItem path="/material" icon="boxes" text="Material" />
      <SideBarItem path="/transaction" icon="exchange" text="Transaction" />
      <SideBarItem path="/other" icon="settings" text="Other" />
    </Menu>
  );
};

export default MySideBar;
