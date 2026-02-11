import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AuthState{
    user: {
        id: number;
        email: string;
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
    } | null;

    token: string | null;
    
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
            setCredentials: (state, action: PayloadAction<{ user: string, token: string }>) => {
            state.user = JSON.parse(action.payload.user);
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem("token", action.payload.token);
        },
        updateUserData: (state, action: PayloadAction<{ firstName?: string; lastName?: string; phoneNumber?: string }>) => {
            if (state.user) {
                if (action.payload.firstName !== undefined) state.user.firstName = action.payload.firstName;
                if (action.payload.lastName !== undefined) state.user.lastName = action.payload.lastName;
                if (action.payload.phoneNumber !== undefined) state.user.phoneNumber = action.payload.phoneNumber;
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