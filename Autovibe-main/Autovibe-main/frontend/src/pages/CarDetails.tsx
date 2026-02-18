import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteCar, getCarById } from "../services/carsService";
import type { CarDetails } from "../services/carsService";
import { useSelector } from "react-redux";
import type { RootState } from "../stores/store";
import ConfirmDialog from "../components/ConfirmDialog";
import { getImageUrl } from "../utils/getImageUrl";
import LoadingSpinner from "../components/UX/LoadingSpinner";

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
    return (
      <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-5">
    <div className="flex justify-center m-5">
        <LoadingSpinner />
      </div>
      </div>
    );
  }
  if (error) {
    return(
    <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6">
            {error}
          </div>
    );
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
       <button 
          className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold rounded-lg transition-all"
          onClick={() => navigate("/cars")}>
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
                src={getImageUrl(car.imageUrls[0])} 
                alt={`${car.make} ${car.model}`} 
                className="w-full h-[500px] md:h-[600px] object-cover"
              />
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-[#70FFE2] text-sm font-bold px-4 py-2 rounded-full border border-slate-700">
                {car.year}
              </div>
              {car.imageUrls.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-full border border-slate-700">
                  {car.imageUrls.length} images
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-[500px] md:h-[600px] bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
              <div className="text-center">
                <span className="text-slate-500 text-lg block mb-2">No image yet</span>
                <span className="text-slate-600 text-sm">The image will be added soon.</span>
              </div>
            </div>
          )}
        </div>

        
        {/* Card */}
        <div className="bg-slate-800 shadow-xl rounded-xl p-8 text-slate-200 space-y-8">
          {/* Main info */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-b border-slate-700 pb-2">
              Main information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p>
                <span className="font-semibold">Price:</span> {car.price.toLocaleString('bg-BG')}
              </p>
              <p>
                <span className="font-semibold">Mileage:</span> {car.mileage} км
              </p>
              <p>
                <span className="font-semibold">Fuel:</span> {car.fuelType}
              </p>
              <p>
                <span className="font-semibold">Transmssion:</span>{" "}
                {car.transmission}
              </p>
              <p>
                <span className="font-semibold">Color:</span> {car.color}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-b border-slate-700 pb-2">
              Description
            </h2>
            <p className="break-words leading-relaxed text-slate-300 ">{car.description}</p>
          </div>

          {/* Dates */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-b border-slate-700 pb-2">
              Dates
            </h2>

            <p>
              <span className="font-semibold">Created on:</span>{" "}
              {new Date(car.createdAt).toLocaleString()}
            </p>

            <p>
              <span className="font-semibold">Updated on :</span>{" "}
              {new Date(car.updatedAt).toLocaleString()}
            </p>
          </div>


          {/* Seller */}
          {!isAuthenticated && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 border-b border-slate-700 pb-2">
                Seller Information <br/>
                <span className="text-sm text-slate-500 font-normal">Login to see the seller's information.</span>
              </h2>
            </div>
          )}
            {isAuthenticated && user && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 border-b border-slate-700 pb-2">
              Seller Information
            </h2>
            <p>
              <span className="font-semibold">Seller: </span> {car.sellerFirstName}{" "}
              {car.sellerLastName}
            </p>
             
            <p>
              <span className="font-semibold">Phone: </span>{" "}
              {car.sellerPhoneNumber}
            </p>
          </div>
            )}
          <div>
            {isOwner && (
              <div className="flex justify-end">
                <button
                  className="mr-2 flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold rounded-lg transition-all"
                  onClick={() => navigate(`/cars/${car.id}/edit`)}
                >
                  Edit
                </button>
                <button
                    className="ml-2 flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-all"
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
