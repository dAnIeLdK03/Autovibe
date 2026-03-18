import { useState } from "react";
import type { CarDetails } from "../../services/carsService";
import { useSelector } from "react-redux";
import type { RootState } from "../../stores/store";
import ConfirmDialog from "../../components/ConfirmDialog";
import { SkeletonLoader } from "../../components/UX/SkeletonLoader";
import { useCarDetails } from "./useCarDetails";
import { useNavigate } from "react-router";
import CarGallery from "./CarGallery";

export default function CarDetails() {
  const {car, isOwner, handleDelete} = useCarDetails();
  const {loading, error } = useSelector((state: RootState) => state.cars);
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);  
    const { user, isAuthenticated} = useSelector((state: RootState) => state.auth);

   if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-5">
    <div className="flex justify-center m-5">
        <SkeletonLoader type="card"/>
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


  return (
    <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-5">
       <button 
          className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold rounded-lg transition-all"
          onClick={() => navigate("/cars")}>
          🡰 Back
        </button>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">
          {car.make} {car.model} {car.year}
        </h1>
        
        <CarGallery 
        imageUrls={car.imageUrls}
        make = {car.make}
        model = {car.model}
        year = {car.year}
        />

        
        <div className="bg-slate-800 shadow-xl rounded-xl p-8 text-slate-200 space-y-8">
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
                <span className="font-semibold">Power:</span> {car.power}
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

          <div>
            <h2 className="text-2xl font-semibold mb-4 border-b border-slate-700 pb-2">
              Description
            </h2>
            <p className="break-words leading-relaxed text-slate-300 ">{car.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 border-b border-slate-700 pb-2">
              Dates
            </h2>

            <p>
              <span className="font-semibold">Created on:</span>{" "}
              {car.createdAt ? new Date(car.createdAt).toLocaleString() : "Unknown"}
            </p>

            <p>
              <span className="font-semibold">Updated on :</span>{" "}
              {car.updatedAt ? new Date(car.updatedAt).toLocaleString() : "Unknown"}
            </p>
          </div>


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
