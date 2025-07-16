import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import UserDashboard from './pages/user/UserDashboard';
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Navbar';
import Profile from './pages/user/Profile';
import MyTickets from './pages/user/MyTickets'
import UserEvents from './pages/user/UserEvents';
import UserIndex from './pages/user/UserIndex';

function App() {
  return (
    <Router>
      {/* <Navbar/> */}
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/Register' element={<Register/>}/>
        
        {/* Protected Route */}
        {/*User*/}
        <Route element={<ProtectedRoute role="User"/>}>
          <Route path='/user' element={<UserDashboard/>}>
            <Route path="profile" element={<Profile />} />
            <Route index element={<UserIndex/>}/>
            <Route path="my-tickets" element={<MyTickets/>} />
            <Route path='events' element={<UserEvents/>}/>
          </Route>
        </Route>
        {/*Organizer*/}
        <Route element={<ProtectedRoute role="Organizer"/>}>
          <Route path='/organizer/dashboard' element={<OrganizerDashboard/>}/>
        </Route>
        {/*Admin*/}
        <Route element={<ProtectedRoute role="Admin"/>}>\
          <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
        </Route>

        {/*404 Error*/}
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </Router>
  )
}

export default App
