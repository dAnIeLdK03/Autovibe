import type { RootState } from "../stores/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { getCarById } from "../services/carsService";
import { updateCar } from "../stores/carsSlice";
import { useDispatch } from "react-redux";

export default function CarEdit() {
  const { id } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (id === null) {
    return <h2>No car selected.</h2>;
  }
  if (user === null) {
    return <h2>You are not logged in.</h2>;
  }
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

    userId: user.id,
  });

  const { userId, ...updateData } = car;

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      setError(null);
      try {
        const car = await getCarById(Number(id));
        fetch(`/api/cars/${id}`)
          .then((res) => res.json())
          .then((data) => {
            setCar(data);
            setLoading(false);
          });
        if (user.id !== car.sellerId) {
          navigate("/cars");
        }
      } catch (error) {
        setError("Unable to load car.");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await dispatch(updateCar({ id: Number(id), ...updateData }));
      navigate(`/cars/${id}`);
    } catch (err) {
      setError("Unable to update car.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Редактирай обява</h2>

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
            onChange={(e) => setCar({ ...car, year: Number(e.target.value) })}
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
            onChange={(e) =>
              setCar({ ...car, mileage: Number(e.target.value) })
            }
            className="w-full border p-2 rounded"
          />

          <select
            title="fuelType"
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
            title="transmission"
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
              "Редактирай обява"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
