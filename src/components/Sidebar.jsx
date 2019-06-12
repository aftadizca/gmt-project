import React from "react";
import { Menu, Header, Label, Dropdown } from "semantic-ui-react";
import SideBarItem from "./../_common/SideBarItem";
import logo from "./../warehouse.svg";
import user from "./../user.svg";
import { NavLink } from "react-router-dom";

const MySideBar = () => {
  const imageProps = {
    avatar: true,
    spaced: "right",
    src: user
  };
  const triggerMenu = (
    <Label
      content={(localStorage.getItem("name") || "GMT USER").toUpperCase()}
      image={imageProps}
      size="big"
      className="user-img"
    />
  );
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
      <SideBarItem path="/other" icon="info" text="Other" />
      <Menu.Menu position="right">
        <Dropdown
          trigger={triggerMenu}
          pointing="top right"
          icon={null}
          className="user-dropdown"
        >
          <Dropdown.Menu>
            <Dropdown.Item
              text="CHANGE PASSWORD"
              icon="key"
              as={NavLink}
              to="/changepassword"
              activeClassName="active"
            />
            <Dropdown.Item
              text="LOGOUT"
              icon="sign out"
              as={NavLink}
              to="/logout"
              activeClassName="active"
            />
          </Dropdown.Menu>
        </Dropdown>
        <div style={{ marginRight: "3rem" }} />
      </Menu.Menu>
    </Menu>
  );
};

export default MySideBar;
