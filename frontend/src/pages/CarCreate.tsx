import type { RootState } from '../stores/store';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { createCar } from '../services/carsService';

export function CarCreate() {
    const {user} = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    if(user === null){
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
        if (car.year < 1900 || car.year > 2100) {
            setError("Годината трябва да е между 1900 и 2100.");
            setLoading(false);
            return;
        }
        if (car.price <= 0) {
            setError("Цената трябва да е по-голяма от 0.");
            setLoading(false);
            return;
        }
        if (!user || !user.id) {
            setError("Потребителят не е намерен. Моля, влезте отново.");
            setLoading(false);
            return;
        }
        
        try{
           await createCar({ ...car, userId: user.id });
            navigate("/cars");
        }catch(error: any){
            let errorMessage = "Unable to create car.";
            
            if (error.response?.data) {
                const data = error.response.data;
                
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
            
            console.error("Create car error:", error.response?.data || error);
            setError(errorMessage);
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=> {
        if(user === null){
            navigate("/login");
        }
    },[user, navigate])

    return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">

      <h2 className="text-2xl font-bold text-center mb-6">Създай обява</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
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
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="model"
          placeholder="Модел"
          value={car.model}
          onChange={(e) => setCar({ ...car, model: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="year"
          placeholder="Година"
          value={car.year}
          onChange={(e) => setCar({ ...car, year: Number (e.target.value) })}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="price"
          placeholder="Цена"
          value={car.price}
          onChange={(e) => setCar({ ...car, price: Number(e.target.value) })}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="mileage"
          placeholder="Пробег"
          value={car.mileage}
          onChange={(e) => setCar({ ...car, mileage: Number(e.target.value) })}
          className="w-full border p-2 rounded"
        />

        <select
          title='fuelType'
          name="fuelType"
          value={car.fuelType}
          onChange={(e) => setCar({ ...car, fuelType: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="">Гориво</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        <select
          title='transmission'
          name="transmission"
          value={car.transmission}
          onChange={(e) => setCar({ ...car, transmission: e.target.value })}
          className="w-full border p-2 rounded"
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
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Описание"
          value={car.description}
          onChange={(e) => setCar({ ...car, description: e.target.value })}
          className="w-full border p-2 rounded h-24"
        />

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
            "Създай обява"
          )}
        </button>

      </form>
    </div>
  </div>
);

}

export default CarCreate
