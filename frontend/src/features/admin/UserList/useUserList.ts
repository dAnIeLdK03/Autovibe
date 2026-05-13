import { getAdminUsers, UserRole, type AdminUserDto, updateUserRoleAdmin } from '../../../api/adminService'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { extractApiErrorMessage } from '../../../shared/extractErrorMessage/extractApiErrorMessage'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@autovibe/app-state'
import {
  clearAdminError,
  setAdminUsers,
  setAdminLoading,
  setAdminError,
  setAdminForbidden,
} from '@autovibe/app-state'

export const useUserList = () => {
  const dispatch = useDispatch()
  const { users, loading, error, forbidden } = useSelector(
    (state: RootState) => state.adminUsers
  )

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [emailFilter, setEmailFilter] = useState('')
  const [appliedEmail, setAppliedEmail] = useState('')

 const handleToggleRole = useCallback(async (userId: number, currentRole: UserRole) => {
  const newRole = currentRole === UserRole.Admin ? UserRole.User : UserRole.Admin;

  try {
    await updateUserRoleAdmin(userId, { role: newRole });

    const updatedUsers = users.map((u) => 
      u.id === userId ? { ...u, role: newRole } : u
    );
    
    dispatch(setAdminUsers(updatedUsers));
  } catch (e: unknown) {
    const errorMsg = extractApiErrorMessage(e);
    dispatch(setAdminError(`Failed to update role: ${errorMsg}`));
  }
}, [users, dispatch]);

  const fetchUsers = useCallback(async () => {
    dispatch(setAdminLoading(true))
    dispatch(clearAdminError())
    dispatch(setAdminForbidden(false))
    
    try {
      const res = await getAdminUsers({
        pageNumber: page,
        pageSize: 18,
        email: appliedEmail || undefined,
      })
      dispatch(setAdminUsers((res.items ?? []) as AdminUserDto[]))
      setTotalPages(res.totalPages ?? 0)
    } catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response?.status === 403) {
        dispatch(setAdminForbidden(true))
        dispatch(setAdminUsers([]))
        setTotalPages(0)
      } else {
        dispatch(setAdminError(extractApiErrorMessage(e)))
      }
    } finally {
      dispatch(setAdminLoading(false))
    }
  }, [page, appliedEmail, dispatch])

  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  const applyEmailSearch = () => {
    setPage(1)
    setAppliedEmail(emailFilter.trim())
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({top: 0, behavior: "smooth"});
  }

  const handleReset = () => {
  setEmailFilter(""); 
  setAppliedEmail("");   
  setPage(1);
};

  const roleLabel = (r: UserRole) => (r === UserRole.Admin ? 'Admin' : 'User')

  return {
    users: users as AdminUserDto[],
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
    handlePageChange,
    handleReset,
    handleToggleRole
  }
}
