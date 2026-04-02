import { useSelector } from "react-redux";
import type { RootState } from "../../../stores/store";
import ConfirmDialog from "../../../shared/ConfirmDialog/ConfirmDialog"; 
import { useState } from "react";
import type { CarDetails } from "../../../api/carsService";
import { useNavigate } from "react-router";

interface CarDeatilsInfoProps {
    car: CarDetails
    isOwner: boolean;
    handleDelete:() => void;
}
function CarDetailsInfo({car, isOwner, handleDelete}: CarDeatilsInfoProps) {

    const { user, isAuthenticated} = useSelector((state: RootState) => state.auth);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);  
    const navigate = useNavigate();

    return (
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
    )
}

export default CarDetailsInfo