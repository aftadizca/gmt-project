import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "../components/Sidebar.css";
import SideBarItem from "./SideBarItem";

const SideBar = () => {
  return (
    <div className="costum-sidebar">
      <ul className="list-group">
        <SideBarItem path="/home" icon="home" text="Home" />
        <SideBarItem path="/material" icon="boxes" text="Material" />
      </ul>
    </div>
  );
};

export default SideBar;
