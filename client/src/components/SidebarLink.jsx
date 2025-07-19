import { NavLink } from "react-router-dom";

const SidebarLink = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block px-4 py-2 rounded hover:bg-blue-100 transition ${
        isActive ? "bg-blue-500 text-white font-semibold" : "text-gray-700"
      }`
    }
  >

    {label}
  </NavLink>
);

export default SidebarLink;
