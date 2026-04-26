import type { CarDetails } from "../../../api/carsService";
import { useSelector } from "react-redux";
import type { RootState } from '@autovibe/app-state';
import { SkeletonLoader } from "../../../shared/UX/SkeletonLoader";
import { useCarDetails } from "./useCarDetails";
import { useNavigate } from "react-router";
import CarGallery from "./CarGallery";
import CarDetailsInfo from "./CarDetailsInfo";

export default function CarDetails() {
  const { car, isOwner, handleDelete } = useCarDetails();
  const { loading, error } = useSelector((state: RootState) => state.cars);
  const navigate = useNavigate();



  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-5">
        <div className="flex justify-center m-5">
          <SkeletonLoader type="card" />
        </div>
      </div>
    );
  }
  if (error) {
    return (
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
          make={car.make}
          model={car.model}
          year={car.year}
        />

        <CarDetailsInfo
          car={car}
          isOwner={isOwner}
          handleDelete={handleDelete}
        />

      </div>
    </div>
  );
}
