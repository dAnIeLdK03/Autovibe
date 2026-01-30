import { api } from './api';

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
};

export interface CarDetails{
    id: number;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    fuelType: string;
    transmission: string;
    color: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;

    sellerId: number;
    sellerFirstName: string;
    sellerLastName: string;
    sellerPhoneNumber: string;

    imageUrls?: string;

};

interface CreateCarRequest{
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    fuelType: string;
    transmission: string;
    color: string;
    description: string;

    userId: number | null;

    imageUrls?: string;

};

interface UpdateCarRequest{
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    fuelType: string;
    transmission: string;
    color: string;
    description: string;

    imageUrls?: string;

};

export const getCars = async(): Promise<Car[]> => {
    const response = await api.get("/cars");
    return response.data;
};

export const getCarById = async(id: number): Promise<CarDetails> => {
    const response = await api.get(`/cars/${id}`);
    return response.data;
};

export const createCar = async(data: CreateCarRequest): Promise<CarDetails> => {
    const response = await api.post("/cars", data);
    return response.data;
};

export const updateCar = async(id: number, data: UpdateCarRequest): Promise<CarDetails> => {
    const response = await api.put(`/cars/${id}`, data);
    return response.data;
};

export const deleteCar = async(id: number): Promise<void> => {
    await api.delete(`/cars/${id}`);
}