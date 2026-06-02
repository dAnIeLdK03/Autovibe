import { useEffect } from 'react'
import { getCurrentUser } from '../../../api/AuthService'; 
import { useDispatch } from 'react-redux';
import { logout, setCredentials, setError } from '@autovibe/app-state';

function AuthRestore() {
    const dispatch = useDispatch();
    const msg = (err: unknown) =>
        err && typeof err === "object" &&
            "message" in err ? String((err as
                { message: string }).message) : "Unable to load user.";


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
                dispatch(setError(msg(error)))
                localStorage.removeItem("token");
                dispatch(logout());
            }
        }
        fetchToken();
    }, [dispatch])
    return null;
}

export default AuthRestore