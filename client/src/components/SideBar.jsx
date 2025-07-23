import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaArrowAltCircleLeft } from "react-icons/fa";
import sidebarLinks from "../constant/sidebarLink";
import { logout } from "../utils/authUtils";
import { useLocation, matchPath } from "react-router-dom";


const Sidebar = ({ role,  isOpen, setIsOpen}) => {
  const [links, setLinks] = useState([]);
 // const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  useEffect(() => {
    if (sidebarLinks[role]) {
      setLinks(sidebarLinks[role]);
    }
  }, [role]);

  return (
    <div
      className={`fixed top-0 left-0 h-full  bg-blue-200 bg-blend-hue border-r shadow-sm z-40 transition-all duration-300 ease-in-out
        ${isOpen ? "w-64" : "w-20"}`}
    >
      {/* Toggle */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2
          className={`text-xl font-bold text-blue-600 transition-opacity duration-300 
            ${isOpen ? "opacity-100" : "opacity-0 hidden"}`}
        >
          {role} Panel
        </h2>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xl text-gray-600 focus:outline-none"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Links */}
      <ul className="flex-1 p-4 space-y-2">
        {links.map(({ to, label, icon, matchPaths }) => {
  const isActive =
    matchPaths &&
    matchPaths.some((path) => matchPath({ path, end: true }, location.pathname));
    //console.log(isActive);
    console.log(matchPaths)
  return (
    <li key={to}>
      <NavLink
       
        to={to}
        className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 transition-colors duration-200
          ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : ""}`}
      >
        <span className="text-xl">{icon}</span>
        <span
          className={`transition-all duration-200 ${
            isOpen ? "opacity-100 ml-2" : "opacity-0 w-0 overflow-hidden"
          }`}
        >
          {label}
        </span>
      </NavLink>
    </li>
  );
})}


        {/* Logout */}
        <li>
          <NavLink
            to="/"
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 text-red-500"
          >
            <FaArrowAltCircleLeft className="text-xl" />
            <span
              className={`transition-all duration-200 ${
                isOpen ? "opacity-100 ml-2" : "opacity-0 w-0 overflow-hidden"
              }`}
            >
              Logout
            </span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
