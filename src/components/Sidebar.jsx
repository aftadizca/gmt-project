import React from "react";
import { Menu, Header } from "semantic-ui-react";
import SideBarItem from "./../_common/SideBarItem";
import logo from "./../warehouse.svg";

const MySideBar = () => {
  return (
    <Menu
      icon="labeled"
      color="blue"
      inverted
      fixed="top"
      size="tiny"
      secondary
      pointing
      className="sidebarx"
    >
      <Menu.Item icon>
        <Header as="h4" className="logo" image={logo} content="GMT" />
      </Menu.Item>
      <SideBarItem path="/home" icon="home" text="Home" />
      <SideBarItem path="/material" icon="boxes" text="Material" />
      <SideBarItem path="/transaction" icon="exchange" text="Transaction" />
      <SideBarItem path="/other" icon="settings" text="Other" />
      <Menu.Menu position="right">
        <SideBarItem path="/logout" icon="sign out" text="Log Out" />
        <div style={{ marginRight: "3rem" }} />
      </Menu.Menu>
    </Menu>
  );
};

export default MySideBar;
