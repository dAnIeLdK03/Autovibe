import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteCar, getCarById } from "../services/carsService";
import type { CarDetails } from "../services/carsService";
import { useSelector } from "react-redux";
import type { RootState } from "../stores/store";

export default function CarDetails() {
  const [car, setCar] = useState<CarDetails | null>({
    id: 0,
    make: "",
    model: "",
    year: 0,
    price: 0,
    mileage: 0,
    fuelType: "",
    transmission: "",
    color: "",
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),

    sellerId: 0,
    sellerFirstName: "",
    sellerLastName: "",
    sellerPhoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <h2>No car selected.</h2>;
  }

  const carId = Number(id);

  const { user } = useSelector((state: RootState) => state.auth);
  const isOwner = user && user.id === car?.sellerId;

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const fetchCar = async () => {
      try {
        const data = await getCarById(carId);
        setCar(data);
      } catch (error) {
        setError("Unable to load car.");
      } finally {
        setLoading(false);
      }
    };
    if(id && !isNaN(Number(id))){
      fetchCar();
    }
  }, [id]);

  if (loading) {
    return <h2>Loading...</h2>;
  }
  if (error) {
    return <h2>{error}</h2>;
  }
  if (car === null) {
    return <h2>Car not found.</h2>;
  }

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const confirm = window.confirm("Are you sure you want to delete this car?");
      if (!confirm) {
        return;
      }
      await deleteCar(car.id);
      navigate("/cars");
    } catch (error) {
      setError("Unable to delete car.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        {/* Заглавие */}
        <h1 className="text-4xl font-bold text-white mb-6 text-center">
          {car.make} {car.model} {car.year}
        </h1>

        {/* Карта */}
        <div className="bg-slate-800 shadow-xl rounded-xl p-8 text-slate-200 space-y-8">
          {/* Основна информация */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-b border-slate-700 pb-2">
              Основна информация
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p>
                <span className="font-semibold">Цена:</span> {car.price} лв.
              </p>
              <p>
                <span className="font-semibold">Пробег:</span> {car.mileage} км
              </p>
              <p>
                <span className="font-semibold">Гориво:</span> {car.fuelType}
              </p>
              <p>
                <span className="font-semibold">Трансмисия:</span>{" "}
                {car.transmission}
              </p>
              <p>
                <span className="font-semibold">Цвят:</span> {car.color}
              </p>
            </div>
          </div>

          {/* Описание */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-b border-slate-700 pb-2">
              Описание
            </h2>
            <p className="leading-relaxed text-slate-300">{car.description}</p>
          </div>

          {/* Дати */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-b border-slate-700 pb-2">
              Дати
            </h2>

            <p>
              <span className="font-semibold">Създадено на:</span>{" "}
              {new Date(car.createdAt).toLocaleString()}
            </p>

            <p>
              <span className="font-semibold">Обновено на:</span>{" "}
              {new Date(car.updatedAt).toLocaleString()}
            </p>
          </div>

          {/* Продавач */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-b border-slate-700 pb-2">
              Информация за продавача
            </h2>

            <p>
              <span className="font-semibold">Име:</span> {car.sellerFirstName}{" "}
              {car.sellerLastName}
            </p>

            <p>
              <span className="font-semibold">Телефон:</span>{" "}
              {car.sellerPhoneNumber}
            </p>
          </div>
          <div>
            {isOwner && (
              <div className="flex justify-end">
                <button
                  className="px-5 py-2.5 bg-slate-700 hover:bg-[#70FFE2] text-white hover:text-slate-900 font-bold rounded-xl transition-all duration-300 text-sm shadow-lg"
                  onClick={() => navigate(`/cars/${car.id}/edit`)}
                >
                  Edit
                </button>
                <button
                  className="px-5 py-2.5 bg-slate-700 hover:bg-[#70FFE2] text-white hover:text-slate-900 font-bold rounded-xl transition-all duration-300 text-sm shadow-lg"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
