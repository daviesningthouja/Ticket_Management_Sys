import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../../styles/user/userdashboard.css";
import {
  FaUser,
  FaTicketAlt,
  FaCalendarAlt,
  FaBars,
  FaTimes,
  FaArrowAltCircleLeft,
} from "react-icons/fa";
import { logout } from "../../utils/authUtils";

const UserDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const sidebarLinks = [
    {
      to: "profile",
      label: "Profile",
      icon: <FaUser />,
      matchPaths: ["profile", "/user/profile/edit"],
    },
    {
      to: "my-tickets",
      label: "My Tickets",
      icon: <FaTicketAlt />,
      matchPaths: ["my-tickets"],
    },
    {
      to: "events",
      label: "Events",
      icon: <FaCalendarAlt />,
      matchPaths: ["events"],
    },
  ];

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
        <h2 className="sidebar-title">{isOpen && "User Panel"}</h2>
        <ul>
          {sidebarLinks.map(({ to, label, icon, matchPaths }) => {
            const isActive = matchPaths.some((path) =>
              location.pathname.startsWith(path)
            );
            return (
              <li key={to}>
                <NavLink to={to} className={isActive ? "active" : ""}>
                  {icon}
                  {isOpen && <span>{label}</span>}
                </NavLink>
              </li>
            );
          })}
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => {
                logout();
              }}
            >
              <FaArrowAltCircleLeft />
              {isOpen && <span>Logout</span>}
            </NavLink>
          </li>
        </ul>
      </aside>
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboard;
