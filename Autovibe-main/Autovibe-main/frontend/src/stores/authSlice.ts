import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface User {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
}

export interface AuthState{
    user: User | null;
    token: string | null;
    
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token")
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
            setCredentials: (state, action: PayloadAction<{ user: User, token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem("token", action.payload.token);
        },
        updateUserData: (state, action: PayloadAction<{ firstName?: string; lastName?: string; phoneNumber?: string }>) => {
            if (state.user) {
                Object.assign(state.user, action.payload);
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
        }

    }

})



export const { setCredentials, updateUserData, logout } = authSlice.actions;

export default authSlice.reducer;