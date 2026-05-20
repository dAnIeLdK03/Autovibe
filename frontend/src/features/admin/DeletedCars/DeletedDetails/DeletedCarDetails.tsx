import { useSelector } from "react-redux";
import { useDeletedCarDetails } from "./useDeletedCarDetails";
import type { RootState } from "@autovibe/app-state";
import { useNavigate } from "react-router";
import { SkeletonLoader } from "../../../../shared/UX/SkeletonLoader";
import CarGallery from "../../../cars/CarDetails/CarGallery";
import CarDetailsInfo from "../../../cars/CarDetails/CarDetailsInfo";


export default function DeletedCarDetails() {
  const { car, handleDelete, handleRestore } = useDeletedCarDetails();
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
        onClick={() => navigate("/admin/deleted")}>
        🡰 Back
      </button>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">
          {car.make} {car.model} {car.year}
        </h1>

        <CarGallery
          carId={car.id}
          imageUrls={car.imageUrls}
          make={car.make}
          model={car.model}
          year={car.year}
          showFavorite={false}
        />

        <CarDetailsInfo
          car={car}
          handleDelete={handleDelete}
          handleRestore={handleRestore}
        />

      </div>
    </div>
  );
}
