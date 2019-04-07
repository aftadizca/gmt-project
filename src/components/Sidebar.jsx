import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";
// import "../components/Sidebar.css";

const SideBar = ({ children, onMouseEnter, onMouseLeave }) => {
  return (
    <div
      className="position-fixed pt-5 p-1 bg-primary h-100 border-right border-dark"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="list-group mt-5 shadow-sm">{children}</div>
    </div>
  );
};

export default SideBar;
