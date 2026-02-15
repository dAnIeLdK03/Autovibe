import type { RootState } from '../stores/store';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { createCar } from '../services/carsService';
import CarCreateValidaions from "../Validations/CarValidations/CarCreateValidaions";
import { extractApiErrorMessage, uploadCarImageIfPresent } from "../Validations/CarValidations/CarSubmitHelpers";
import type { CarFormValues } from "../Validations/CarValidations/CarCreateValidaions";
import { useForm } from 'react-hook-form';


export function CarCreate() {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  if (user === null) {
    navigate("/login");
    return null;
  }

  const { register, handleSubmit, formState: { errors } } = useForm<CarFormValues>();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (formData: CarFormValues) => {
    setError(null);

    // Client-side validation
    const errorMessage = CarCreateValidaions(formData as CarFormValues);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }
    const errorImage = await uploadCarImageIfPresent(imageFile);
    if (errorImage.error) {
      setError(errorImage.error);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { ...dataToApi } = formData;
      await createCar({ ...dataToApi, imageUrls: errorImage.imageUrls });
      navigate("/cars");
    } catch (error: any) {
      setError(extractApiErrorMessage(error, "Unable to create car."));
    } finally {
      setLoading(false);
    }
  }



  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      setImageFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setImagePreview(objectUrl);
    }
  };

  // Cleanup: Free URL on unmount or imagePreview change
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 font-sans">
      <div className="w-full max-w-md p-8 bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700 m-3 shadow-2xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-black text-white tracking-tight mb-2">Create Ad</h2>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <input
            type="text"
            className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
            placeholder='Make'
            {...register("make", {
              required: "Make is required"
            })}
          />
          {errors.make && <span className="text-red-500 text-sm">{errors.make.message as string}</span>}

          <input
            type="text"
            placeholder="Model"
            className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
            {...register("model", {
              required: "Model is required"
            })}
          />
          {errors.model && <span className="text-red-500 text-sm">{errors.model.message as string}</span>}

          <input
            type="number"
            placeholder="Year"
            className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
            {...register("year", {
              required: "Year is required"
            })}
          />
          {errors.year && <span className="text-red-500 text-sm">{errors.year.message as string}</span>}

          <input
            type="number"
            placeholder="Price"
            className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
            {...register("price", {
              required: "Price is required"
            })}
          />
          {errors.price && <span className="text-red-500 text-sm">{errors.price.message as string}</span>}

          <input
            type="number"
            placeholder="Mileage"
            className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
            {...register("mileage", {
              required: "Mileage is required"
            })}
          />
          {errors.mileage && <span className="text-red-500 text-sm">{errors.mileage.message as string}</span>}

          <select
            title='fuelType'
            className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
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
            className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
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
            className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
            {...register("color", {
              required: "Color is required"
            })}
          />
          {errors.color && <span className="text-red-500 text-sm">{errors.color.message as string}</span>}


          <textarea
            placeholder="Description"
            className="w-full px-5 py-10 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
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
              className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
            />
          </label>
          {imagePreview && <img src={imagePreview} alt="Image preview" className="w-full h-auto" />}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? (
              <div className="flex justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              "Create Ad"
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/cars")}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Cancel
          </button>

        </form>
      </div>
    </div>
  );

}

export default CarCreate
