import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "../../../api/AuthService";
import { logout, setCredentials } from "../../../stores/authSlice";

function AuthRestore() {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                
                if (!token) {
                    dispatch(logout());
                    return;
                }

                const user = await getCurrentUser();
                
                if (user) {
                    dispatch(setCredentials({ user, token }));
                } else {
                    throw new Error("User not found");
                }

            } catch (error: any) {
                if (error?.response?.status === 401) {
                    console.log("Session expired, logging out...");
                } else {
                    console.warn("Auth restore failed:", error.message);
                }

                await AsyncStorage.removeItem("token");
                dispatch(logout());
            }
        };

        fetchToken();
    }, [dispatch]);

    return null;
}

export default AuthRestore;