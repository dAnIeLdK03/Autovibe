import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Car{
    id: number;
    make: string; 
    model: string;
    year: number;
    price: number;
    mileage: number;
    fuelType: string;
    transmission: string;
    color: string;
    shortDescription?: string;

    userId: number;

    imageUrls?: string;
}

export interface CarState{
    cars: Car[];
    selectedCar: Car | null;
    loading: boolean;
    error: string | null;
}

const initialState : CarState = {
    cars: [],
    selectedCar: null,
    loading: false,
    error: null
}

const carsSlice = createSlice({
    name: 'cars',
    initialState,
    reducers: {
        setCars : (state, action: PayloadAction<Car[]>) => {
            state.cars = action.payload;
        },
        setSelectedCar: (state, action: PayloadAction<Car | null>) => {
            state.selectedCar = action.payload;
        },
        addCar: (state, action: PayloadAction<Car>) => {
            state.cars.push(action.payload);
        },
        updateCar: (state, action: PayloadAction<Car>) => {
            const index = state.cars.findIndex(car => car.id === action.payload.id);
            state.cars[index] = action.payload;
        },
        removeCar: (state, action: PayloadAction<number>) => {
            state.cars = state.cars.filter(car => car.id !== action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    }
})

export const {setCars, setSelectedCar, addCar, updateCar, removeCar, setLoading, setError, clearError } = carsSlice.actions;

export default carsSlice.reducer;