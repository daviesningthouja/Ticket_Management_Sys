import React, { useState } from 'react'
import { getUserRole } from '../utils/authUtils';
//import Sidebar from '../components/SideBar';
import Sidebar from '../components/SideBar';
import { Outlet } from 'react-router-dom';
const LayoutDash = () => {
   const [isSidebarOpen, setSidebarOpen] = useState(true);
  const role = getUserRole(); // e.g., "User", "Organizer", "Admin"
    console.log(role);
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* <Sidebar role={role}/> */}
      <Sidebar role={role} isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
        <div
          className={`transition-all duration-300 flex-1 
          ${
            isSidebarOpen ? 'ml-64' : 'ml-20'
          }`}
        >
        <header className="bg-white shadow p-4">
          <h1 className="text-xl font-semibold text-center">Welcome, {role}</h1>
        </header>
        <main className="p-6 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutDash
