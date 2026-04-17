import { api } from './api';
import type { Car } from '../stores/carsSlice';



export interface CarDetails {
    id: number;
    bodyType: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    power: number;
    fuelType: string;
    transmission: string;
    color: string;
    description: string;
    location: string;
    steeringWheel: string;
    condition: string;
    
    createdAt?: Date;
    updatedAt?: Date;

    sellerId: number;
    sellerFirstName: string;
    sellerLastName: string;
    sellerPhoneNumber: string;

    imageUrls?: string[];

};

interface CreateCarRequest {
    bodyType: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    power: number;
    fuelType: string;
    transmission: string;
    color: string;
    description: string;
    location: string;
    steeringWheel: string;
    condition: string;

    imageUrls?: string[];

};

export interface UpdateCarRequest {
    bodyType: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    power: number;
    fuelType: string;
    transmission: string;
    color: string;
    description: string;
    location: string;
    steeringWheel: string;
    condition: string;

    imageUrls?: string[];

};
export interface CarCardProps {
    car: {
        id: number,
        bodyType: string;
        make: string,
        model: string,
        year: number,
        price: number,
        mileage: number,
        power: number,
        fuelType: string,
        transmission: string,
        color: string,
        shortDescription: string,
        location: string,
        steeringWheel: string,
        condition: string,

        imageUrls?: string[];
    }
    onDeleteClick?: (id: number) => void;
    showDeletebutton?: boolean;
};

export interface CarFilters{
    fuelType?: string;
    transmission?: string;
    mileage?: string;
    yearRange:{min: string, max: string};
    power?: string;
    bodyType?: string;
    location?: string;
    steeringWheel?: string;
    condition: string;
    sortType: string;
    published?: string;
};

export interface SortOption {
  id: string;
  label: string;
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

export const getCars = async (page: number, pageSize: number, filters: CarFilters): Promise<CarsPageResponse> => {
    const params = new URLSearchParams();
    params.append('pageNumber', page.toString());
    params.append('pageSize', pageSize.toString());

    if(filters.yearRange.min) params.set("minYear", filters.yearRange.min);
    if(filters.yearRange.max) params.set("maxYear", filters.yearRange.max);
    if(filters.fuelType && filters.fuelType !== "Fuel"){
        params.set("fuelType", filters.fuelType);
    }
    if(filters.transmission && filters.transmission !== "Transmission"){
        params.set("transmission", filters.transmission);
    }
    if(filters.mileage && filters.mileage !== "Mileage"){
        params.set("mileage", filters.mileage);
    }
    if(filters.power && filters.power !== "" && filters.power !== "0"){
        params.set("power", filters.power);
    }
    if(filters.bodyType && filters.bodyType != "" && filters.bodyType !== "BodyType"){
        params.set("bodyType", filters.bodyType);
    }
    if(filters.location && filters.location != "" && filters.location != "Location"){
        params.set("location", filters.location);
    }
    if(filters.steeringWheel && filters.steeringWheel != "" && filters.steeringWheel != "SteeringWheel"){
        params.set("steeringWheel", filters.steeringWheel);
    }
    if (
        filters.condition &&
        filters.condition !== "" &&
        filters.condition !== "All" &&
        filters.condition !== "Condition"
    ) {
        params.set("condition", filters.condition);
    }
    if(filters.published && filters.published != "" && filters.published != "Published"){
        params.set("published", filters.published);
    }
    if(filters.sortType && filters.sortType !== "SortType"){
        params.set("sortType", filters.sortType ?? "");
    }
    
    const response = await api.get(`/cars?${params}`);
    return response.data;
};

export const getCarsByUserId = async (page: number, pageSize: number): Promise<CarsPageResponse> => {
     const params = new URLSearchParams();
    params.append('pageNumber', page.toString());
    params.append('pageSize', pageSize.toString());

    const response = await api.get<CarsPageResponse>(`/cars/my-cars?${params.toString()}`);
    const data = response.data;
    if (!data || !Array.isArray(data.items)) {
        throw new Error("Unable to load cars.");
    }
    return { 
        items: data.items, 
        totalPages: data.totalPages ?? 0, 
        pageNumber: data.pageNumber ?? page, 
        pageSize: data.pageSize ?? pageSize };
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