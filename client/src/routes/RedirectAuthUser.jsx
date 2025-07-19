import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../utils/authUtils';
//import { getUser } from '../utils/authUtils';
//import {jwtDecode} from 'jwt-decode'; // Install with: npm install jwt-decode

const RedirectAuthuser = () => {
  const token = getToken();
  //const user = getUser();
  if (token) 
    return <Navigate to={`/`} replace />;
  return <Outlet />;
};

export default RedirectAuthuser;