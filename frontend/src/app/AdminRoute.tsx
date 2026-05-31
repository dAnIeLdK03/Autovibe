import type React from "react";
import type { ProtectedRouteProps } from "./ProtectedRoute";
import { useSelector } from "react-redux";
import type { RootState } from "@autovibe/app-state";
import { Navigate, Outlet } from "react-router-dom";


export const AdminRoute: React.FC<ProtectedRouteProps> =({
    redirectPath = '/login'
}) => {
    const isAuthenticated = useSelector((s: RootState) => s.auth);
    const role = useSelector((s:RootState) => s.auth.user?.role)
    if(!isAuthenticated){
        return <Navigate to = {redirectPath} replace />;
    }

    // 0 = Admin
    if(role !== 0){
        return <Navigate to = {redirectPath} replace />;
    }

    return <Outlet />
}