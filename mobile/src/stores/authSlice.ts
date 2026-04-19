import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  hydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },

    updateUserData: (
      state,
      action: PayloadAction<{
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
      }>,
    ) => {
      if (state.user) {
        Object.assign(state.user, action.payload);
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },

    setHydrated: (state, action: PayloadAction<boolean>) => {
      state.hydrated = action.payload;
    },
  },
});

export const {
  setCredentials,
  setToken,
  updateUserData,
  logout,
  setHydrated,
} = authSlice.actions;

export default authSlice.reducer;