import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@autovibe/app-state';

export interface ProtectedRouteProps {
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = '/login'
}) => {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);

  if(!isAuthenticated){
    return <Navigate to = {redirectPath} replace />

  }

  return <Outlet />
};