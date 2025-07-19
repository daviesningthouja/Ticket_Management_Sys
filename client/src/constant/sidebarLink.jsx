import { FaUser, FaTicketAlt, FaCalendarAlt, FaUsers, FaCogs } from "react-icons/fa";

const sidebarLinks = {
  User: [
    { to: "/user", label: "Dashboard Home" },
    { to: "/user/profile", label: "Profile" },
    { to: "/user/edit", label: "Edit Profile" },
    { to: "/user/my-tickets", label: "My Tickets" },
    { to: "/user/events", label: "Browse Events" },
  ],
  Organizer: [
    { to: "/organizer/dash", label: "Dashboard Home" ,icon:<FaUser/>  },
    { to: "/organizer/profile", label: "Profile",icon:<FaUser/> },
    { to: "/organizer/events", label: "Events",icon:<FaUser/> },
    { to: "/organizer/create-event", label: "Create Event" ,icon:<FaUser/>},
    { to: "/organizer/sales", label: "Sales Report" ,icon:<FaUser/>},
  ],
  Admin: [
    { to: "/admin", label: "Admin Dashboard" },
    { to: "/admin/users", label: "Manage Users" },
    { to: "/admin/events", label: "All Events" },
    { to: "/admin/settings", label: "Settings" },
  ],
};

export default sidebarLinks;
