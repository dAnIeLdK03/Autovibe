import { useEffect } from 'react'
import { getCurrentUser } from '../../../api/AuthService'; 
import { useDispatch } from 'react-redux';
import { logout, setCredentials } from '@autovibe/app-state';

function AuthRestore() {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = sessionStorage.getItem("token");
                if(!token){
                    dispatch(logout());
                    return;
                }

                const user = await getCurrentUser();
                if(user){
                    dispatch(setCredentials({user, token}));
                }else{
                    throw new Error("User not found");
                }

            } catch (error) {
                console.error("Error fetching current user:", error);
                sessionStorage.removeItem("token");
                dispatch(logout());
            }
        }
        fetchToken();
    }, [dispatch])
    return null;
}

export default AuthRestore