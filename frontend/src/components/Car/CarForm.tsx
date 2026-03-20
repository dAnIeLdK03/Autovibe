import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import type { CarFormValues } from '../../Validations/CarValidations/CarCreateValidaions';
import type { RootState } from '../../stores/store';
import FuelSelector from '../FuelSelector';
import TransmissionSelector from '../TransmissionSelector';

interface CarFormProps {
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    imagePreview: string[];
    submitLabel?: string;
    title: string;
    onRemoveImage?: (index: number) => void;
}

function CarForm({ handleImageChange, imagePreview, onRemoveImage, submitLabel = "Create", title = "Create Ad" }: CarFormProps) {
    const { register, formState: { errors }, setValue, watch } = useFormContext<CarFormValues>();
    const { error } = useSelector((state: RootState) => state.cars)
    const { loading } = useSelector((state: RootState) => state.cars)
    const navigate = useNavigate();
    const fuelType = watch("fuelType");
    const transmissionType = watch("transmission");


    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 font-sans">
            <div className="w-full max-w-md p-8 bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700 m-4 shadow-2xl">

                <div className="mb-10 text-center">
                    <h2 className="text-4xl font-black text-white tracking-tight mb-2">{title}</h2>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}


                <input
                    type="text"
                    className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600 mb-2"
                    placeholder='Make'
                    {...register("make", {
                        required: "Make is required"
                    })}
                />
                {errors.make && <span className="text-red-500 text-sm">{errors.make.message as string}</span>}

                <input
                    type="text"
                    placeholder="Model"
                    className="mb-2 w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
                    {...register("model", {
                        required: "Model is required"
                    })}
                />
                {errors.model && <span className="text-red-500 text-sm">{errors.model.message as string}</span>}

                <input
                    type="number"
                    placeholder="Year"
                    className="mb-3 w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
                    {...register("year", {
                        required: "Year is required",
                        valueAsNumber: true

                    })}
                />
                {errors.year && <span className="text-red-500 text-sm">{errors.year.message as string}</span>}

                <input
                    type="number"
                    placeholder="Price"
                    className="mb-3 w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
                    {...register("price", {
                        required: "Price is required",
                        valueAsNumber: true


                    })}
                />
                {errors.price && <span className="text-red-500 text-sm">{errors.price.message as string}</span>}

                <input
                    type="number"
                    placeholder="Mileage"
                    className=" mb-3 w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
                    {...register("mileage", {
                        required: "Mileage is required",
                        valueAsNumber: true

                    })}
                />
                {errors.mileage && <span className="text-red-500 text-sm">{errors.mileage.message as string}</span>}

                <input
                    type="number"
                    placeholder="Power"
                    className=" mb-3 w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
                    {...register("power", {
                        required: "Power is required",
                        valueAsNumber: true

                    })}
                />
                {errors.power && <span className="text-red-500 text-sm">{errors.power.message as string}</span>}

                <input type="hidden" {...register("fuelType", { required: "Fuel type is required" })} />
                <input type="hidden" {...register("transmission", { required: "Transmission is required" })} />

                <FuelSelector
                    value={fuelType ?? "Fuel"}
                    onChange={(val: any) => {
                        setValue("fuelType", val, { shouldValidate: true, shouldDirty: true });
                    }}
                />
                {errors.fuelType && <span className="text-red-500 text-sm">{errors.fuelType.message as string}</span>}

                <TransmissionSelector
                    value={transmissionType ?? "Transmission"}
                    onChange={(val: any) => {
                        setValue("transmission", val, { shouldValidate: true, shouldDirty: true });
                    }}
                />
                {errors.transmission && <span className="text-red-500 text-sm">{errors.transmission.message as string}</span>}

                <input
                    type="text"
                    placeholder="Color"
                    className="mb-3 w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
                    {...register("color", {
                        required: "Color is required"
                    })}
                />
                {errors.color && <span className="text-red-500 text-sm">{errors.color.message as string}</span>}


                <textarea
                    placeholder="Description"
                    className="mb-3 w-full px-5 py-10 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
                    {...register("description", {
                        required: "Description is required"
                    })}
                />
                {errors.description && <span className="text-red-500 text-sm">{errors.description.message as string}</span>}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                    <label className="flex flex-col items-center justify-center h-28 bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-2xl cursor-pointer hover:border-[#70FFE2]/50 hover:bg-slate-800/50 transition-all group">
                        <span className="text-2xl text-slate-500 group-hover:text-[#70FFE2]">+</span>
                        <span className="text-xs text-slate-600 mt-1 group-hover:text-slate-400">Add Photos</span>
                        <input
                            type="file"
                            name="images"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>

                    {imagePreview ?? [].map((url, index) => (
                        <div
                            key={url}
                            className="relative h-28 group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
                        >
                            <img
                                src={url}
                                alt={`preview-${index}`}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => onRemoveImage?.(index)}
                                    className="p-2 bg-red-500/80 rounded-full text-white hover:bg-red-600 transition-colors"
                                >✕</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#70FFE2] text-slate-900 py-4 rounded-2xl hover:brightness-110 disabled:opacity-50 font-bold text-lg transition-all shadow-[0_0_20px_rgba(112,255,226,0.2)]"
                    >
                        {loading ? (
                            <div className="flex justify-center">
                                <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            submitLabel
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/cars")}
                        className="w-full bg-slate-700/50 text-white py-4 rounded-2xl hover:bg-slate-700 transition-all font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CarForm;