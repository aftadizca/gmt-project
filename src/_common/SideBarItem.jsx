import React from "react";
import { NavLink } from "react-router-dom";
import { Menu, Icon } from "semantic-ui-react";

const SideBarItem = ({ text, path, icon }) => {
  return (
    <React.Fragment>
      <Menu.Item as={NavLink} to={path} activeClassName="active">
        <Icon name={icon} />
        {text.toUpperCase()}
      </Menu.Item>
    </React.Fragment>
  );
};

export default SideBarItem;
