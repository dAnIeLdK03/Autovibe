import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { FavoriteService } from '../favoriteServiceTypes'
import { logout, type AuthState } from './authSlice'
import type { CarState } from './carsSlice'

export interface FavoritesState {
  ids: number[];
  loading: boolean;
  error: boolean;
  loadingCarIds: number[];
}

const initialState: FavoritesState = {
  ids: [],
  loading: false,
  error: false,
  loadingCarIds: [],
}

type FavoritesThunkConfig = {
  state: { auth: AuthState; cars: CarState; favorites: FavoritesState }
  extra: FavoriteService
}

export const loadFavoriteIds = createAsyncThunk<number[], void, FavoritesThunkConfig>(
  'favorites/loadFavoriteIds',
  async (_, { extra }) => {
    const pageSize = 18
    let page = 1
    const ids = new Set<number>()

    let totalPages = 1
    while (page <= totalPages) {
      const res = await extra.getFavoritesByUserId(page, pageSize)
      for (const car of res.items ?? []) ids.add(car.id)

      totalPages = res.totalPages ?? 0
      if (totalPages === 0) break
      page += 1
    }

    return Array.from(ids)
  }
)

export const toggleFavorite = createAsyncThunk<
  { carId: number; nextIsFavorite: boolean },
  { carId: number; isFavorite: boolean },
  FavoritesThunkConfig
>(
  'favorites/toggleFavorite', 
  async ({ carId, isFavorite }, { extra }) => {
    if (isFavorite) {
      await extra.deleteFavorite(carId)
      return { carId, nextIsFavorite: false }
    }

    await extra.addFavorite(carId)
    return { carId, nextIsFavorite: true }
  },
  {
    condition: ({ carId }, { getState }) => {
      const { favorites } = getState()
      if (favorites.loadingCarIds.includes(carId)) {
        return false
      }
    }
  }
)

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavoriteIds: (state, action: PayloadAction<number[]>) => {
      state.ids = action.payload
    },
    clearFavorites: (state) => {
      state.ids = []
      state.loading = false
      state.error = false
      state.loadingCarIds = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavoriteIds.pending, (state) => {
        state.loading = true
        state.error = false
      })
      .addCase(loadFavoriteIds.fulfilled, (state, action) => {
        state.ids = action.payload
        state.loading = false
        state.error = false
      })
      .addCase(loadFavoriteIds.rejected, (state) => {
        state.loading = false
        state.error = true
      })
      
      .addCase(toggleFavorite.pending, (state, action) => {
        const { carId, isFavorite } = action.meta.arg;
        
        state.loadingCarIds.push(carId);

        if (isFavorite) {
          state.ids = state.ids.filter(id => id !== carId);
        } else {
          if (!state.ids.includes(carId)) state.ids.push(carId);
        }
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { carId, nextIsFavorite } = action.payload
        
        state.loadingCarIds = state.loadingCarIds.filter(id => id !== carId);
        
        const has = state.ids.includes(carId)
        if (nextIsFavorite && !has) state.ids.push(carId)
        if (!nextIsFavorite && has) state.ids = state.ids.filter((id) => id !== carId)
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        const { carId, isFavorite } = action.meta.arg;
        
        state.loadingCarIds = state.loadingCarIds.filter(id => id !== carId);
        state.error = true;

        if (isFavorite) {
          if (!state.ids.includes(carId)) state.ids.push(carId);
        } else {
          state.ids = state.ids.filter(id => id !== carId);
        }
      })
      .addCase(logout, (state) => {
        return initialState;
      });
  },
})

export const { setFavoriteIds, clearFavorites } = favoritesSlice.actions
export default favoritesSlice.reducer