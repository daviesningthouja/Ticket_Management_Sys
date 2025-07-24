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
    { to: "/organizer", label: "Dashboard Home" ,icon:<FaUser/>, matchPaths:["/organizer", "/organizer/"] },
    { to: "/organizer/profile", label: "Profile",icon:<FaUser/> ,  matchPaths:["/organizer/profile"]},
    { to: "/organizer/events", label: "Events",icon:<FaUser/>, matchPaths:["/organizer/events"] },
    { to: "/organizer/event/create", label: "Create Event" ,icon:<FaUser/>, matchPaths:["/organizer/event/create"]},
    { to: "/organizer/sales-report", label: "Sales Report" ,icon:<FaUser/> , matchPaths:["/organizer/sales-report"]},
  ],
  Admin: [
    { to: "/admin", label: "Admin Dashboard", matchPaths:["/admin", "/admin/"]},
    { to: "/admin/profile", label: "Profile",icon:<FaUser/> ,  matchPaths:["/admin/profile"] },
    { to: "/admin/users", label: "Manage Users", icon:<FaCogs/>, matchPaths:["/admin/users"] },
    { to: "/admin/events", label: "All Events", icon:<FaCalendarAlt/>, matchPaths:["/admin/events"]},
    { to: "/admin/pending/events", label: "Pending Event" },
    { to: "/admin/revenue", label: "Revenue" },
  ],
};

export default sidebarLinks;
