import { getAdminUsers, UserRole, type AdminUserDto, } from "../../../api/adminService";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { extractApiErrorMessage } from "../../../shared/extractErrorMessage/extractApiErrorMessage";


export const useUserList = () => {
    const [users, setUsers] = useState<AdminUserDto[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [emailFilter, setEmailFilter] = useState("");
    const [appliedEmail, setAppliedEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [forbidden, setForbidden] = useState(false);

    const fecthUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        setForbidden(false);
        try{
            const res = await getAdminUsers({
                pageNumber: page,
                pageSize: 18,
                email: appliedEmail || undefined,
            });
            setUsers(res.items ?? []);
            setTotalPages(res.totalPages ?? 0);
        }catch(e: unknown){
            if(axios.isAxiosError(e) && e.response?.status === 403){
                setForbidden(true);
                setUsers([]);
                setTotalPages(0);
            }else{
                setError(extractApiErrorMessage(e));
            }
        }finally{
            setLoading(false);
        }
    },[page, appliedEmail]);

    useEffect(() => {
        void fecthUsers();
    },[fetch]);

    const applyEmailSearch = () => {
        setPage(1);
        setAppliedEmail(emailFilter.trim());
    };

    const roleLabel = (r: UserRole) => {
        r === UserRole.Admin ? "Admin" : "User";
    }

    return {
        users,
        page,
        setPage,
        totalPages,
        emailFilter,
        setEmailFilter,
        applyEmailSearch,
        loading,
        error,
        forbidden,
        roleLabel,
    };
}
