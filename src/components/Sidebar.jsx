import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "../components/Sidebar.css";
import SideBarItem from "./SideBarItem";

const SideBar = ({ children, onMouseEnter, onMouseLeave }) => {
  return (
    <div
      className="costum-sidebar"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ul className="list-group">{children}</ul>
    </div>
  );
};

export default SideBar;
