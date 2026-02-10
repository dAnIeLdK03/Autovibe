import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import carsReducer from './carsSlice'

export type RootState = ReturnType<typeof store.getState>;

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cars: carsReducer
    },
});
