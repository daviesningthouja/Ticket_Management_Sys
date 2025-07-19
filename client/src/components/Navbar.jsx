import React from 'react'
import {Link, useNavigate} from 'react-router-dom';
import {getToken, getUser, logout} from "../utils/authUtils";
import "../styles/component/navbar.css"
import Button from './Button';
const Navbar = () => {
    const token = getToken();
    const navigate = useNavigate();

    const user = getUser();
    console.log(user);
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
            {token ? (
                <>
                    <Button onClick={handleLogout}>Logout</Button>
                    {user.role === "User" && <li><Link to='/user'>Dashboard</Link></li>}
                    {user.role ==="Organizer" && <li><Link to="/organizer">Dashboard</Link></li>}
                    {user.role ==="Admin" && <li><Link to="/admin">Dashboard</Link></li>}

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
