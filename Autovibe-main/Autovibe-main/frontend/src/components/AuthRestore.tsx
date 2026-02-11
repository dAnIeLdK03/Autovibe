import { useEffect } from 'react'
import { getCurrentUser } from '../services/AuthService';
import { useDispatch } from 'react-redux';
import { setCredentials, logout } from '../stores/authSlice';
function AuthRestore() {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const user = await getCurrentUser();
                    dispatch(setCredentials({ user: JSON.stringify(user), token: token }));
                }
            } catch (error) {
                console.error("Error fetching current user:", error);
                localStorage.removeItem("token");
                dispatch(logout());
            }
        }
        fetchToken();
    }, [])
    return null;
}

export default AuthRestore