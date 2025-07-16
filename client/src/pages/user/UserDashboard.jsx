import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../../styles/userdashboard.css';
import { FaUser, FaTicketAlt, FaCalendarAlt, FaBars, FaTimes } from 'react-icons/fa';

const UserDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
        <h2 className="sidebar-title">{isOpen && 'User Panel'}</h2>
        <ul>
          <li>
            <Link to="profile">
              <FaUser />
              {isOpen && <span>Profile</span>}
            </Link>
          </li>
          <li>
            <Link to="my-tickets">
              <FaTicketAlt />
              {isOpen && <span>My Tickets</span>}
            </Link>
          </li>
          <li>
            <Link to="events">
              <FaCalendarAlt />
              {isOpen && <span>Events</span>}
            </Link>
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
