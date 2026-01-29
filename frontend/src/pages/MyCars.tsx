import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import type { RootState } from "../stores/store";
import { deleteCar, getCars } from "../services/carsService";
import { setCars, setLoading, setError, clearError } from "../stores/carsSlice";
import React from "react";

function MyCars() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  if (!isAuthenticated || user === null) {
    navigate("/login");
    return null;
  }
  useEffect(() => {
    if (!user || !user.id) {
      return;
    }
    dispatch(setLoading(true));
    dispatch(clearError());
    const fetchCars = async () => {
      try {
        const allCars = await getCars();
        // Filter cars where userId matches, handling undefined userId
        const myCars = allCars.filter((car) => car.userId !== undefined && car.userId === user.id);
        dispatch(setCars(myCars));
      } catch (error: any) {
        console.error("Error loading cars:", error);
        const errorMessage = error.response?.data?.message || error.message || "Unable to load your cars.";
        dispatch(setError(errorMessage));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchCars();
  }, [user?.id, dispatch]);

  const { cars, loading, error } = useSelector(
    (state: RootState) => state.cars,
  );

  const handleDelete = async (carId: string | number) => {
      dispatch(setLoading(true));
      dispatch(clearError());
      try {
        const confirm = window.confirm("Are you sure you want to delete this car?");
        if (!confirm) {
          dispatch(setLoading(false));
          return;
        }
        const id = Number(carId);
        await deleteCar(id);
        // remove deleted car from local state
        dispatch(setCars(cars.filter((c) => c.id !== id)));
        navigate("/cars");
      } catch (error) {
        dispatch(setError("Unable to delete car."));
      } finally {
        dispatch(setLoading(false));
      }
    };

 
  return (
    <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">
              My <span className="text-[#70FFE2]">Cars</span>
            </h1>
            <p className="text-slate-400">
              Manage your listings ({cars.length} {cars.length === 1 ? 'ad' : 'ads'})
            </p>
          </div>
          <button 
            className="px-6 py-3 bg-[#70FFE2] hover:bg-[#5ee6cb] text-slate-900 font-bold rounded-xl transition-all duration-300 shadow-lg"
            onClick={() => navigate("/cars/new")}
          >
            + Create New Ad
          </button>
        </div>

        {/* 2. Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* 3. Empty State */}
        {!loading && cars.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-dashed border-slate-700">
            <p className="text-slate-400 text-lg mb-6">Нямате създадени обяви. Създайте първата!</p>
            
          </div>
        ) : (
          /* 4. Grid List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <div 
                key={car.id} 
                className="group relative bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700 overflow-hidden hover:border-[#70FFE2]/50 transition-all duration-500 shadow-2xl flex flex-col"
              >
                {/* Car Image Placeholder */}
                <div className="relative h-48 bg-slate-700 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10" />
                  <span className="absolute top-4 left-4 z-20 bg-slate-900/80 backdrop-blur-md text-[#70FFE2] text-xs font-bold px-3 py-1.5 rounded-full border border-slate-700">
                    {car.year}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white group-hover:text-[#70FFE2] transition-colors duration-300">
                        {car.make}
                      </h2>
                      <p className="text-slate-400 font-medium">{car.model}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#70FFE2] text-2xl font-black">€{car.price.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex flex-wrap gap-2 pt-4 border-t border-slate-700/50">
                    <button 
                      className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition-all"
                      onClick={() => navigate(`/cars/${car.id}`)}
                    >
                      Details
                    </button>
                    <button 
                      className="flex-1 px-3 py-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white text-xs font-bold rounded-lg transition-all"
                      onClick={() => handleDelete(car.id)}
                    >
                      Delete
                    </button>
                     
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCars;
