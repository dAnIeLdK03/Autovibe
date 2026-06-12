import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AdminUser {
  id: number
  email: string
  firstName?: string | null
  lastName?: string | null
  phoneNumber?: string | null
  createdAt?: string | null
  updatedAt?: string | null
  role: number
  isBlocked?: boolean | null
  blockedUntil?: string | null
  blockReason?: string | null
}

export interface AdminUsersState {
  users: AdminUser[]
  loading: boolean
  error: string | null
  forbidden: boolean
}

const initialState: AdminUsersState = {
  users: [],
  loading: false,
  error: null,
  forbidden: false,
}

const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    setAdminUsers: (state, action: PayloadAction<AdminUser[]>) => {
      state.users = action.payload
    },
    setAdminLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setAdminError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearAdminError: (state) => {
      state.error = null
    },
    setAdminForbidden: (state, action: PayloadAction<boolean>) => {
      state.forbidden = action.payload
    },
  },
})

export const {
  setAdminUsers,
  setAdminLoading,
  setAdminError,
  clearAdminError,
  setAdminForbidden,
} = adminUsersSlice.actions

export default adminUsersSlice.reducer
