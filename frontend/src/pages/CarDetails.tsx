import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteCar, getCarById } from "../services/carsService";
import type { CarDetails } from "../services/carsService";
import { useSelector } from "react-redux";
import type { RootState } from "../stores/store";
import ConfirmDialog from "../components/ConfirmDialog";

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

    imageUrls: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <h2>No car selected.</h2>;
  }

  const carId = Number(id);

  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const isOwner = user && user.id === car?.sellerId;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);  

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
    return (<div className="flex justify-center">
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin">loading</div>
    </div>
    );
  }
  if (error) {
    <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6">
            {error}
          </div>
  }
  if (car === null) {
    return <h2>Car not found.</h2>;
  }
  


  const handleDelete = async () => {
    if(car.sellerId !== user?.id){  
      setError("You are not the owner of this car.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setShowDeleteConfirm(true);
      await deleteCar(carId);
      navigate("/cars");
    } catch (error) {
      setError("Unable to delete car.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-5">
       <button className=" px-6 py-3 bg-slate-700 hover:bg-[#70FFE2] text-white hover:text-slate-900 font-bold rounded-xl transition-all duration-300 text-sm shadow-lg" onClick={() => navigate("/cars")}>
          🡰 Back
        </button>
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-white mb-6 text-center">
          {car.make} {car.model} {car.year}
        </h1>
        
        {/* Main image */}
        <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl">
          {car.imageUrls && car.imageUrls.length > 0 ? (
            <div className="relative">
              <img 
                src={`http://localhost:5258${car.imageUrls[0]}`} 
                alt={`${car.make} ${car.model}`} 
                className="w-full h-[500px] md:h-[600px] object-cover"
              />
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-[#70FFE2] text-sm font-bold px-4 py-2 rounded-full border border-slate-700">
                {car.year}
              </div>
              {car.imageUrls.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-full border border-slate-700">
                  {car.imageUrls.length} снимки
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-[500px] md:h-[600px] bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
              <div className="text-center">
                <span className="text-slate-500 text-lg block mb-2">Няма снимка</span>
                <span className="text-slate-600 text-sm">Снимката ще бъде добавена скоро</span>
              </div>
            </div>
          )}
        </div>

        {/* Галерия с миниатюри (ако има повече снимки) */}
        {car.imageUrls && car.imageUrls.length > 1 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Допълнителни снимки</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {car.imageUrls.slice(1).map((imageUrl, index) => (
                <div 
                  key={index}
                  className="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border-2 border-slate-700 hover:border-[#70FFE2]"
                  onClick={() => {
                    // Може да добавиш функционалност за промяна на главната снимка
                    const newUrls = [imageUrl, ...car.imageUrls!.filter((_, i) => i !== index + 1)];
                    setCar({ ...car, imageUrls: newUrls });
                  }}
                >
                  <img 
                    src={`http://localhost:5258${imageUrl}`} 
                    alt={`${car.make} ${car.model} - Снимка ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Карта */}
        <div className="bg-slate-800 shadow-xl rounded-xl p-8 text-slate-200 space-y-8">
          {/* Основна информация */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-b border-slate-700 pb-2">
              Основна информация
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p>
                <span className="font-semibold">Цена:</span> {car.price.toLocaleString('bg-BG')}
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

          {/* Description */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-b border-slate-700 pb-2">
              Описание
            </h2>
            <p className="break-words leading-relaxed text-slate-300 ">{car.description}</p>
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
          {!isAuthenticated && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 border-b border-slate-700 pb-2">
                Информация за продавача <br/>
                Please login to view seller information.
              </h2>
            </div>
          )}
            {isAuthenticated && user && (
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
            )}
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
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete
                </button>
                <ConfirmDialog 
                  isOpen={showDeleteConfirm}
                  title="Delete Car"
                  message="Are you sure you want to delete this car?"
                  onConfirmClick={handleDelete}
                  onClose={() => setShowDeleteConfirm(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
