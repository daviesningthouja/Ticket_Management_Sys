import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
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
import RedirectAuthuser from './routes/RedirectAuthUser';
import EditProfile from './pages/user/EditProfile';
import LayoutDash from './pages/LayoutDash';
import ManageEvents from './pages/organizer/ManageEvents';
import EventDetail from './pages/organizer/EventDetail';

function App() {
  return (
    <Router>
      {/* <Navbar/> */}
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route element={<RedirectAuthuser/>}>
          <Route path='/login' element={<Login/>}/>
        </Route>
        <Route path='/Register' element={<Register/>}/>
        
        {/* Protected Route */}
        {/*User*/}
        <Route element={<ProtectedRoute role="User"/>}>
          <Route path='/user' element={<UserDashboard/>}>
            <Route index element={<UserIndex/>}/>
            <Route path="profile" element={<Profile />} />
            <Route path="profile/edit" element={<EditProfile/>}/>
            <Route path="my-tickets" element={<MyTickets/>} />
            <Route path='events' element={<UserEvents/>}/>
          </Route>
        </Route>
        {/*Organizer*/}
        <Route element={<ProtectedRoute role="Organizer"/>}>
          <Route path='/organizer' element={<LayoutDash/>}>
            <Route index path='dash' element={<OrganizerDashboard/>}/>
            <Route path="profile" element={<Profile/>}/>
            <Route path="events" element={<ManageEvents/>}/>
            <Route path='event/:id' element={<EventDetail/>}/>
          </Route>
        </Route>
        {/*Admin*/}
        <Route element={<ProtectedRoute role="Admin"/>}>\
          <Route path='/admin' element={<LayoutDash/>}/>
        </Route>

        {/*404 Error*/}
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </Router>
  )
}

export default App
