import React, { Component } from "react";
import { NavLink } from "react-router-dom";

const SideBarItem = ({ text, path, icon, showTextSidebarItem }) => {
  return (
    <li className="nav-item">
      <NavLink className="nav-link" to={path} activeClassName="active">
        <i className={`fas fa-${icon} fa-lg`} />{" "}
        {showTextSidebarItem ? text : ""}
      </NavLink>
    </li>
  );
};

export default SideBarItem;
