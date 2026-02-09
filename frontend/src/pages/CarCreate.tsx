import type { RootState } from '../stores/store';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { createCar } from '../services/carsService';
import CarCreateValidaions from "../Validations/CarValidations/CarCreateValidaions";
import { extractApiErrorMessage, uploadCarImageIfPresent, validateCarOwner } from "../Validations/CarValidations/CarSubmitHelpers";
import type { CarFormValues } from "../Validations/CarValidations/CarCreateValidaions";

export function CarCreate() {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  if (user === null) {
    navigate("/login");
    return null;
  }

  const [car, setCar] = useState({
    make: "",
    model: "",
    year: 0,
    price: 0,
    mileage: 0,
    fuelType: "",
    transmission: "",
    color: "",
    description: "",

    userId: user.id
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    const errorMessage = CarCreateValidaions(car as CarFormValues);
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
    const errorSeller = await validateCarOwner(car.userId, user?.id);
    if (errorSeller) {
      setError(errorSeller);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      await createCar({ ...car, userId: user.id, imageUrls: errorImage.imageUrls });
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

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="make"
            placeholder="Make"
            value={car.make}
            onChange={(e) => setCar({ ...car, make: e.target.value })}
            className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
          />

          <input
            type="text"
            name="model"
            placeholder="Model"
            value={car.model}
            onChange={(e) => setCar({ ...car, model: e.target.value })}
            className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
          />

          <input
            type="number"
            name="year"
            placeholder="Year"
            value={car.year}
            onChange={(e) => setCar({ ...car, year: Number(e.target.value) })}
            className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={car.price}
            onChange={(e) => setCar({ ...car, price: Number(e.target.value) })}
            className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
          />

          <input
            type="number"
            name="mileage"
            placeholder="Mileage"
            value={car.mileage}
            onChange={(e) => setCar({ ...car, mileage: Number(e.target.value) })}
            className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
          />

          <select
            title='fuelType'
            name="fuelType"
            value={car.fuelType}
            onChange={(e) => setCar({ ...car, fuelType: e.target.value })}
            className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
          >
            <option value="">Fuel Type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <select
            title='transmission'
            name="transmission"
            value={car.transmission}
            onChange={(e) => setCar({ ...car, transmission: e.target.value })}
            className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
          >
            <option value="">Transmission</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>

          <input
            type="text"
            name="color"
            placeholder="Color"
            value={car.color}
            onChange={(e) => setCar({ ...car, color: e.target.value })}
            className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={car.description}
            onChange={(e) => setCar({ ...car, description: e.target.value })}
            className="w-full px-5 py-10 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
          />
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

        </form>
      </div>
    </div>
  );

}

export default CarCreate
