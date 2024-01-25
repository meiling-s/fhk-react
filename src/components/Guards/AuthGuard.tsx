import React from 'react'
import { useKeycloak } from '@react-keycloak/web';
import { Navigate, Outlet } from 'react-router-dom';

const AuthGuard = () => {
  
const hasUser = Boolean(localStorage.getItem('username'));
  
  
  if (!hasUser) return <Navigate to={'/'} />;
  
  return <Outlet />;
}

export default AuthGuard