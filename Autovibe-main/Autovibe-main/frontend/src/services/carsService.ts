import { api } from './api';
import type { Car } from '../stores/carsSlice';



export interface CarDetails {
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

    imageUrls?: string[];

};

interface CreateCarRequest {
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    fuelType: string;
    transmission: string;
    color: string;
    description: string;


    imageUrls?: string[];

};

export interface UpdateCarRequest {
    make?: string;
    model?: string;
    year?: number;
    price?: number;
    mileage?: number;
    fuelType?: string;
    transmission?: string;
    color?: string;
    description?: string;

    imageUrls?: string[];

};
export interface CarCardProps {
    car: {
        id: number,
        make: string,
        model: string,
        year: number,
        price: number,
        mileage: number,
        fuelType: string,
        transmission: string,
        color: string,
        shortDescription: string,
        imageUrls?: string[];
    }
    onDeleteClick?: (id: number) => void;
    showDeletebutton?: boolean;
}


export interface CarsPageResponse {
    items: Car[];
    totalPages: number;
    pageNumber: number;
    pageSize: number;
}

export interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirmClick?: () => void | Promise<void>;
    onClose?: () => void;
}

export const getCars = async (page: number, pageSize: number): Promise<CarsPageResponse> => {
    const response = await api.get<CarsPageResponse>(`/cars?pageNumber=${page}&pageSize=${pageSize}`);
    const data = response.data;
    if (!data || !Array.isArray(data.items)) {
        throw new Error("Unable to load cars.");
    }
    return { items: data.items, totalPages: data.totalPages ?? 0, pageNumber: data.pageNumber ?? page, pageSize: data.pageSize ?? pageSize };
};

export const getCarsByUserId = async (page: number, pageSize: number): Promise<CarsPageResponse> => {
    const response = await api.get<CarsPageResponse>(`/cars/my-cars?pageNumber=${page}&pageSize=${pageSize}`);const data = response.data;
    if (!data || !Array.isArray(data.items)) {
        throw new Error("Unable to load cars.");
    }
    return { items: data.items, totalPages: data.totalPages ?? 0, pageNumber: data.pageNumber ?? page, pageSize: data.pageSize ?? pageSize };
};

export const getCarById = async (id: number): Promise<CarDetails> => {
    const response = await api.get(`/cars/${id}`);
    return response.data;
};

export const createCar = async (data: CreateCarRequest): Promise<CarDetails> => {
    const response = await api.post("/cars", data);
    return response.data;
};

export const updateCar = async (id: number, data: UpdateCarRequest, imageUrls?: string[]): Promise<CarDetails> => {
    const response = await api.put(`/cars/${id}`, { ...data, imageUrls: imageUrls });
    return response.data;
};

export const deleteCar = async (id: number): Promise<void> => {
    await api.delete(`/cars/${id}`);
}