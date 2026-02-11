import type { RootState } from "../stores/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { getCarById, updateCar } from "../services/carsService";
import CarCreateValidaions, { type CarFormValues } from "../Validations/CarValidations/CarCreateValidaions";
import { extractApiErrorMessage, uploadCarImageIfPresent, validateCarOwner } from "../Validations/CarValidations/CarSubmitHelpers";
import { useImageUpload } from "../Validations/CarValidations/CarImageUpload";


export default function CarEdit() {
  const { id } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();

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

    sellerId: 0,

  });
  const { imageFile, imagePreview, handleImageChange } = useImageUpload();
 

  useEffect(() => {
    const fetchCar = async () => {
      if (!id || !user?.id) {
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await getCarById(Number(id));

        if (id && data.sellerId !== user?.id) {
          setError("You are not the owner of this car.");
          setTimeout(() => {
            navigate("/cars");
          }, 2000);
          return;
        }

        setCar(data);

      } catch (error) {
        setError("Unable to load car.");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id, user?.id, navigate]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError(null);

    // Client-side validation
    const errorMessage = CarCreateValidaions(car as CarFormValues);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    const { imageUrls, error: uploadError } = await uploadCarImageIfPresent(imageFile);
    if (uploadError) {
      setError(uploadError);
      setLoading(false);
      return;
    }

    const ownerError = validateCarOwner(car.sellerId, user?.id);
    if (ownerError) {
      setError(ownerError);
      setLoading(false);
      return;
    }
    if(imageFile){
      const { error: uploadError } = await uploadCarImageIfPresent(imageFile);
      if (uploadError) {
        setError(uploadError);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      const { sellerId, ...payload } = car;
      await updateCar(Number(id), payload, imageUrls);
      navigate(`/cars/${id}`);
    } catch (error: any) {
      setError(extractApiErrorMessage(error, "Unable to create car."));
    } finally {
      setLoading(false);
    }
  };


  if (!id) {
    return <h2>No car selected.</h2>;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 font-sans">
      <div className="w-full max-w-md p-8 bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700 m-3 shadow-2xl">

        <div className="mb-10 text-center">
          <h2 className="text-4xl font-black text-white tracking-tight mb-2">Edit Ad</h2>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            onChange={(e) =>
              setCar({ ...car, mileage: Number(e.target.value) })
            }
            className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
          />

          <select
            title="fuelType"
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
            title="transmission"
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
          {imagePreview && (
          <div className="relative group mt-4">
            <div className="w-full h-56 rounded-2xl overflow-hidden border border-slate-700 bg-slate-800">
              <img
                src={imagePreview}
                alt="Car Preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
          )}
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
              "Edit Ad"
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/cars/${id}`)}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
