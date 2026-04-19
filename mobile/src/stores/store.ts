import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import carsReducer from './carsSlice'
import favoritesReducer from './favoritesSlice'

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cars: carsReducer,
        favorites: favoritesReducer
    },
});
