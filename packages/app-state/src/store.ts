import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import carsReducer from './slices/carsSlice'
import favoritesReducer from './slices/favoritesSlice'
import adminUsersReducer from './slices/adminUsersSlice'
import type { FavoriteService } from './favoriteServiceTypes'

export function createAutovibeStore(favorite: FavoriteService) {
  return configureStore({
    reducer: {
      auth: authReducer,
      cars: carsReducer,
      favorites: favoritesReducer,
      adminUsers: adminUsersReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: favorite,
        },
      }),
  })
}

export type AutovibeStore = ReturnType<typeof createAutovibeStore>
export type RootState = import('./types').RootState
export type AppDispatch = AutovibeStore['dispatch']
