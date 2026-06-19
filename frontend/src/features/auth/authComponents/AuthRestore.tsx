import { useEffect } from 'react'
import { getCurrentUser } from '../../../api/AuthService'; 
import { useDispatch } from 'react-redux';
import { logout, setCredentials, setError } from '@autovibe/app-state';
import { extractApiErrorMessage } from '../../../shared/extractErrorMessage/extractApiErrorMessage';

function AuthRestore() {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = localStorage.getItem("token");
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
                dispatch(setError(extractApiErrorMessage(error)))
                localStorage.removeItem("token");
                dispatch(logout());
            }
        }
        fetchToken();
    }, [dispatch])
    return null;
}

export default AuthRestore