import { useCallback, useEffect, useState } from "react";
import { getAdminUserById, UserRole, type AdminUserDto } from "../../../api/adminService";
import axios from "axios";
import { extractApiErrorMessage } from "../../../shared/extractErrorMessage/extractApiErrorMessage";
import { useParams } from "react-router";


export const useUserDetails = () => {
    const {id} = useParams<{id: string}>();

    const userId = Number(id);
    const invalidId = !userId || userId < 1;

    const [user, setUser] = useState<AdminUserDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [forbidden, setForbidden] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const fetchUser = useCallback(async () => {
        if(invalidId){
            setUser(null);
            setLoading(false);
            setError(null);
            setForbidden(false);
            setNotFound(false);
        }
        
        setLoading(true);
        setError(null);
        setForbidden(false);
        setNotFound(false);
        try{
            const data = await getAdminUserById(userId);
            setUser(data);
        }catch(e: unknown){
            setUser(null);
            if(axios.isAxiosError(e)){
                const status = e.response?.status;
                if(status === 403){
                    setForbidden(true);
                }else if(status === 404){
                    setNotFound(true);
                }else{
                    setError(extractApiErrorMessage(e));
                }
            }else{
                setError(extractApiErrorMessage(e));
            }
        }
        finally{
            setLoading(false);
        }
    }, [userId, invalidId])

    useEffect(() => {
       void fetchUser();
    }, [fetchUser])

     const roleLabel = (r: UserRole) => (r === UserRole.Admin ? 'Admin' : 'User')

    return{
        user,
        loading,
        error,
        forbidden,
        notFound,
        invalidId,
        roleLabel,
        refetch: fetchUser,
    };
};