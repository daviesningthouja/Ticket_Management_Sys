import React from 'react'
import {Link, useNavigate} from 'react-router-dom';
import {getUser, logout} from "../utils/authUtils";
import "../styles/navbar.css"
const Navbar = () => {
    const user = getUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }
  return (
    <nav className="navbar">
        <div className='navbar-logo'>
            <Link to="/">TicketSys</Link>
        </div>
        <ul className='navbar-links'>
            <li><Link to="/">Home</Link></li>
            {user ? (
                <>
                    <button onClick={handleLogout}>Logout</button>
                    {user.role === "User" && <li><Link to='/user'>Dashboard</Link></li>}
                    {user.role ==="Organizer" && <li><Link to="/organizer/dashboard">Dashboard</Link></li>}
                    {user.role ==="Admin" && <li><Link to="/admin/dashboard">Dashboard</Link></li>}

                </>
            ) : (
                <>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/register">Register</Link>
                    </li>
                </>
            )}
        </ul>
    </nav>
  )
}

export default Navbar
