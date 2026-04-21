;import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "../../../api/AuthService";
import { logout, setCredentials } from "../../../stores/authSlice";


function AuthRestore() {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchToken = async () => {
            try{
                const token = await AsyncStorage.getItem("token");
                if(token){
                    const user = await getCurrentUser();
                    if(user) {
                        dispatch(setCredentials({ user: user, token: token}))
                    }
                    else{
                        await AsyncStorage.removeItem("token");
                        dispatch(logout());
                    }
                }
            }catch(error){
                console.error("Error fetching current user:", error);
                await AsyncStorage.removeItem("token");
                dispatch(logout());
            }
        };
        fetchToken();
    }, [dispatch]);
    return null;
}
export default AuthRestore;