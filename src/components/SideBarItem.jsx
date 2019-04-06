import React, { Component } from "react";
import { NavLink } from "react-router-dom";

const SideBarItem = ({ text, path, icon }) => {
  return (
    <li className="nav-item">
      <NavLink className="nav-link" to={path} activeClassName="active">
        <span className={`fas fa-${icon} text-normal`} /> {text}
      </NavLink>
    </li>
  );
};

export default SideBarItem;
