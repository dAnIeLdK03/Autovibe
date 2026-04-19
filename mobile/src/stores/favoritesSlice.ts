import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { addFavorite, deleteFavorite, getFavoritesByUserId } from "../api/favoriteService";

export interface FavoritesState {
  ids: number[];
  loading: boolean;
}

const initialState: FavoritesState = {
  ids: [],
  loading: false,
};

export const loadFavoriteIds = createAsyncThunk<number[]>(
  "favorites/loadFavoriteIds",
  async () => {
    const pageSize = 18;
    let page = 1;
    const ids = new Set<number>();

    let totalPages = 1;
    while (page <= totalPages) {
      const res = await getFavoritesByUserId(page, pageSize);
      for (const car of res.items ?? []) ids.add(car.id);

      totalPages = res.totalPages ?? 0;
      if (totalPages === 0) break;
      page += 1;
    }

    return Array.from(ids);
  }
);

export const toggleFavorite = createAsyncThunk<
  { carId: number; nextIsFavorite: boolean },
  { carId: number; isFavorite: boolean }
>("favorites/toggleFavorite", async ({ carId, isFavorite }) => {
  if (isFavorite) {
    await deleteFavorite(carId);
    return { carId, nextIsFavorite: false };
  }

  await addFavorite(carId);
  return { carId, nextIsFavorite: true };
});

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setFavoriteIds: (state, action: PayloadAction<number[]>) => {
      state.ids = action.payload;
    },
    clearFavorites: (state) => {
      state.ids = [];
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavoriteIds.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadFavoriteIds.fulfilled, (state, action) => {
        state.ids = action.payload;
        state.loading = false;
      })
      .addCase(loadFavoriteIds.rejected, (state) => {
        state.loading = false;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { carId, nextIsFavorite } = action.payload;
        const has = state.ids.includes(carId);
        if (nextIsFavorite && !has) state.ids.push(carId);
        if (!nextIsFavorite && has) state.ids = state.ids.filter((id) => id !== carId);
      });
  },
});

export const { setFavoriteIds, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;

