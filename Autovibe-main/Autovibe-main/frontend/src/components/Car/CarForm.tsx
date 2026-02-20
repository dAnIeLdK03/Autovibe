import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import type { CarFormValues } from '../../Validations/CarValidations/CarCreateValidaions';
import type { RootState } from '../../stores/store';


interface CarFormProps {
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    imagePreview: string | null;
    submitLabel?: string;
    title: string;
}

function CarForm({ handleImageChange, imagePreview, submitLabel = "Create", title = "Create Ad" }: CarFormProps) {
    const { register, formState: { errors } } = useFormContext<CarFormValues>();
    const { error } = useSelector((state: RootState) => state.cars)
    const { loading } = useSelector((state: RootState) => state.cars)
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 font-sans">
            <div className="w-full max-w-md p-8 bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700 m-4 shadow-2xl">

                {/* Header */}
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

                <select
                    title='fuelType'
                    className="mb-3 w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
                    {...register("fuelType", {
                        required: "Fuel type is required"
                    })}
                >
                    <option value="">Fuel Type</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                </select>
                {errors.fuelType && <span className="text-red-500 text-sm">{errors.fuelType.message as string}</span>}

                <select
                    title='transmission'
                    className=" mb-3 w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
                    {...register("transmission", {
                        required: "Transmission is required"
                    })}
                >
                    <option value="">Transmission</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                </select>
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

                <label className="block text-sm font-medium text-slate-400">
                    Image
                    <input
                        type='file'
                        name="image"
                        accept='image/*'
                        onChange={handleImageChange}
                        className="mb-3 w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
                    />
                </label>
                {imagePreview && <img src={imagePreview} className="w-full h-auto" />}

                <button
                    type="submit"
                    disabled={loading}
                    className="mb-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 text-l  rounded-lg transition-all"
                >
                    {loading ? (
                        <div className="flex justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        submitLabel
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/cars")}
                    className="mb-3 w-full bg-red-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 text-l  rounded-lg transition-all"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default CarForm