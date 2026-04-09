import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import type { CarFormValues } from './CarValidations/CarCreateValidaions'; 
import type { RootState } from '../../../stores/store'; 
import { getImageUrl } from '../../../utils/getImageUrl'; 
import { BaseSelect } from './Filters/BaseSelect';
import { bodyTypes, fuelTypeOptions, transmissionTypes, wheelTypes } from '../../../api/carOptions';



interface CarFormProps {
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    imagePreview: string[];
    submitLabel?: string;
    title: string;
    onRemoveImage?: (index: number) => void;
}

function CarForm({ handleImageChange, imagePreview, onRemoveImage, submitLabel = "Create", title = "Create Ad" }: CarFormProps) {
    const { register, formState: { errors }, setValue, watch } = useFormContext<CarFormValues>();
    const { error, loading } = useSelector((state: RootState) => state.cars)
    const navigate = useNavigate();
    const fuelType = watch("fuelType");
    const transmissionType = watch("transmission");
    const wheelType = watch("steeringWheel");
    const bodyType = watch("bodyType");

    const MAX_CHARS = 5000;
    const descriptionValue = watch("description") || "";
    const charCount = descriptionValue.length;

    const galleryImages = (imagePreview ?? []).slice(0, 10);

    const inputClasses = "w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all placeholder:text-slate-600 text-sm";
    const labelClasses = "text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block ml-1";

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 font-sans p-4">
            <div className="w-full max-w-2xl p-8 bg-slate-800/40 backdrop-blur-2xl rounded-[2.5rem] border border-slate-700/50 shadow-2xl">
                
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-black text-white mb-2">{title}</h2>
                    <p className="text-slate-500 text-sm">Fill in the technical specifications below</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       
                        <div>
                            <label className={labelClasses}>Make</label>
                            <input type="text" className={inputClasses} placeholder="e.g. Audi" {...register("make", { required: "Required" })} />
                            {errors.make && <p className="text-red-500 text-xs mt-1 ml-1">{errors.make.message as string}</p>}
                        </div>
                        <div>
                            <label className={labelClasses}>Model</label>
                            <input type="text" className={inputClasses} placeholder="e.g. RS6" {...register("model", { required: "Required" })} />
                            {errors.model && <p className="text-red-500 text-xs mt-1 ml-1">{errors.model.message as string}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                            <label className={labelClasses}>Year</label>
                            <input type="number" className={inputClasses} placeholder="2024" {...register("year", { required: true, valueAsNumber: true })} />
                        </div>
                        <div>
                            <label className={labelClasses}>Price (€)</label>
                            <input type="number" className={inputClasses} placeholder="Price" {...register("price", { required: true, valueAsNumber: true })} />
                        </div>
                        <div>
                            <label className={labelClasses}>Km</label>
                            <input type="number" className={inputClasses} placeholder="Mileage" {...register("mileage", { required: true, valueAsNumber: true })} />
                        </div>
                        <div>
                            <label className={labelClasses}>Power (hp)</label>
                            <input type="number" className={inputClasses} placeholder="HP" {...register("power", { required: true, valueAsNumber: true })} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                            <BaseSelect
                                variant='dropdown'
                                label='Fuel'
                                options={fuelTypeOptions}
                                value={fuelType ?? ""}
                                onChange={(val) => setValue("fuelType", val, {shouldValidate: true})}
                            />
                        </div>
                         <div className="md:col-span-1">
                            <BaseSelect
                                variant='dropdown'
                                label='Body Type'
                                options={bodyTypes}
                                value={bodyType ?? ""}
                                onChange={(val) => setValue("bodyType", val, {shouldValidate: true})}
                            />
                        </div>
                        <div className="md:col-span-1">
                            <BaseSelect
                                variant='dropdown'
                                label='Transmission'
                                options={transmissionTypes}
                                value={transmissionType ?? ""}
                                onChange={(val) => setValue("transmission", val, {shouldValidate: true})}
                            />
                        </div>
                        <div className="md:col-span-1">
                            <BaseSelect
                                variant='dropdown'
                                label='Steering Wheel'
                                options={wheelTypes}
                                value={wheelType ?? ""}
                                onChange={(val) => setValue("steeringWheel", val, {shouldValidate: true})}
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className={labelClasses}>Color</label>
                            <input type="text" className={inputClasses} placeholder="Color" {...register("color", { required: true })}  />
                        </div>
                        <div className="md:col-span-1">
                            <label className={labelClasses}>Location</label>
                            <input type="text" className={inputClasses} placeholder="Location" {...register("location", { required: true })} />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-1 px-1">
                            <label className={labelClasses}>Description</label>
                            <span className={`text-[10px] font-mono ${charCount > MAX_CHARS ? 'text-red-500' : 'text-slate-500'}`}>
                                {charCount} / {MAX_CHARS}
                            </span>
                        </div>
                        <textarea
                            placeholder="Describe your vehicle..."
                            className={`${inputClasses} min-h-[300px] py-4 resize-none leading-relaxed mb-5`}
                            {...register("description", { required: "Description is required", maxLength: MAX_CHARS })}
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1 ml-1">{errors.description.message as string}</p>}
                    </div>

                    <span className="text-base text-slate-400 group-hover:text-[#70FFE2]">Info: To upload multiple photos at once, hold down the "Ctrl" key while selecting the desired photos.</span>

                    <div>
                        <label className={labelClasses}>Photos ({galleryImages.length}/10)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {galleryImages.length < 10 && (
                                <label className="flex flex-col items-center justify-center h-24 bg-slate-900/40 border-2 border-dashed border-slate-700 rounded-2xl cursor-pointer hover:border-[#70FFE2]/50 hover:bg-slate-800/40 transition-all group">
                                    <span className="text-xl text-slate-500 group-hover:text-[#70FFE2]">+</span>
                                    <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                                </label>
                            )}
                            {galleryImages.map((url, index) => (
                                <div key={url} className="relative h-24 group rounded-xl overflow-hidden border border-slate-800">
                                    <img src={getImageUrl(url)} alt="car" className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => onRemoveImage?.(index)}
                                        className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold"
                                    >✕</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 space-y-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#70FFE2] text-slate-900 py-4 rounded-2xl hover:brightness-110 disabled:opacity-50 font-black text-lg transition-all shadow-[0_10px_20px_rgba(112,255,226,0.15)]"
                        >
                            {loading ? <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" /> : submitLabel}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/cars")}
                            className="w-full bg-transparent text-slate-400 py-3 rounded-xl hover:text-white transition-all text-sm font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CarForm;