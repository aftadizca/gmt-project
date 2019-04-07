import React from "react";
import { NavLink } from "react-router-dom";

const SideBarItem = ({ text, path, icon, showTextSidebarItem }) => {
  return (
    <NavLink
      className="list-group-item list-group-item-action list-group-item-primary"
      to={path}
      activeClassName="active"
    >
      <i className={`fas fa-${icon} fa-lg`} />
      {showTextSidebarItem ? <div className="ml-4 d-inline">{text}</div> : ""}
    </NavLink>
  );
};

export default SideBarItem;
