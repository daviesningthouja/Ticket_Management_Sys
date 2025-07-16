import React from 'react'
import { Navigate,Outlet } from 'react-router-dom';
import {getUser} from '../utils/authUtils';

const ProtectedRoute = ({role}) => {
    const user = getUser();

    if(!user) return <Navigate to="/login"/>
    if(role && user.role !== role) return <Navigate to="/"/>

    return <Outlet/>

}

export default ProtectedRoute;
