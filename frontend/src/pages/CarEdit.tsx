import type { RootState } from "../stores/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { getCarById, updateCar } from "../services/carsService";
import { uploadImage } from "../services/imageService";

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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      if(!id || !user?.id){
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await getCarById(Number(id));

        if(id && data.sellerId !== user?.id){
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
    if(!id) return;
    setLoading(true);
    setError(null);
    
    // Client-side validation
    if (!car.make.trim()) {
      setError("Марката е задължителна.");
      setLoading(false);
      return;
    }
    if (!car.model.trim()) {
      setError("Моделът е задължителен.");
      setLoading(false);
      return;
    }
    if (car.year < 1900 || car.year > new Date().getFullYear()) {
            setError("Year must be between 1900 and current year.");
            setLoading(false);
            return;
        }
    if (car.price <= 0) {
      setError("Цената трябва да е по-голяма от 0.");
      setLoading(false);
      return;
    }
    let imageUrls: string[] | undefined;
    if(imageFile){
      try{
        const imageUrl = await uploadImage(imageFile);
        imageUrls = [imageUrl];
      }catch(error){
        setError("Unable to upload image.");
        setLoading(false);
        return;
      }
    }
    if(car.sellerId !== user?.id){
      setError("You are not the owner of this car.");
      setLoading(false);
      return;
    }
    
    
    try {
      const {sellerId, ...payload } = car;
      await updateCar(Number(id), payload, imageUrls);
      navigate(`/cars/${id}`);
    } catch (error: any) {
      // Extract the actual error message from the backend
      let errorMessage = "Unable to update car.";
      
      if (error.response?.data) {
        const data = error.response.data;
        
        // Handle ModelState errors (validation errors from ASP.NET)
        if (typeof data === 'object' && !data.message) {
          const errors: string[] = [];
          for (const key in data) {
            if (Array.isArray(data[key])) {
              errors.push(...data[key]);
            } else if (typeof data[key] === 'string') {
              errors.push(data[key]);
            }
          }
          errorMessage = errors.length > 0 ? errors.join(', ') : JSON.stringify(data);
        } else {
          errorMessage = data.message || data || errorMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error("Update car error:", error.response?.data || error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        if(selectedFile){
          if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
          }
          
          setImageFile(selectedFile);
          const objectUrl = URL.createObjectURL(selectedFile);
          setImagePreview(objectUrl);
        }
      };

    useEffect(() => {
      return () => {
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }
      };
    }, [imagePreview]);


  if(!id){
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
            placeholder="Марка"
            value={car.make}
            onChange={(e) => setCar({ ...car, make: e.target.value })}
          className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
          />

          <input
            type="text"
            name="model"
            placeholder="Модел"
            value={car.model}
            onChange={(e) => setCar({ ...car, model: e.target.value })}
          className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
          />

          <input
            type="number"
            name="year"
            placeholder="Година"
            value={car.year}
            onChange={(e) => setCar({ ...car, year: Number(e.target.value) })}
          className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
          />

          <input
            type="number"
            name="price"
            placeholder="Цена"
            value={car.price}
            onChange={(e) => setCar({ ...car, price: Number(e.target.value) })}
          className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
          />

          <input
            type="number"
            name="mileage"
            placeholder="Пробег"
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
            <option value="">Гориво</option>
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
            <option value="">Трансмисия</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>

          <input
            type="text"
            name="color"
            placeholder="Цвят"
            value={car.color}
            onChange={(e) => setCar({ ...car, color: e.target.value })}
          className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-[#70FFE2] focus:border-transparent transition-all duration-300 placeholder:text-slate-600"
          />

          <textarea
            name="description"
            placeholder="Описание"
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
              "Еdit Ad"
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
