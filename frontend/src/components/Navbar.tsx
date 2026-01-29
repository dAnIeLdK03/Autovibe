import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../stores/store';
import { logout } from '../services/AuthService';
import { iseDispatch } from 'react-redux';


function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user, isAuthenticated} = useSelector((state: RootState) => state.auth);

    const handleLogout = async () => {
        dispatch(logout())
        localStorage.removeItem("token")
        navigate("/login")
    }

  return (
    <div>
      
    </div>
  )
}

export default Navbar
