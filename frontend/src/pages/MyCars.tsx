import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import type { RootState } from "../stores/store";
import { deleteCar, getCars } from "../services/carsService";
import type { CarCardProps } from "../services/carsService";
import { setCars, setLoading, setError, clearError } from "../stores/carsSlice";
import CarCard from "../components/CarCard";
import ConfirmDialog from "../components/ConfirmDialog";

function MyCars() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { cars, loading, error } = useSelector((state: RootState) => state.cars);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [carIdToDelete, setCarIdToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      navigate("/login");
      return;
    }
    dispatch(setLoading(true));
    dispatch(clearError());
    const fetchCars = async () => {
      try {
        const response = await getCars(1, 500);
        const allCars = response.items ?? [];
        const myCars = allCars.filter((c) => c.userId === user.id);
        dispatch(setCars(myCars));
      } catch (err: unknown) {
        const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Unable to load your cars.";
        dispatch(setError(msg));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchCars();
  }, [user?.id, isAuthenticated, navigate, dispatch]);

  const handleDeleteClick = (id: number) => {
    setCarIdToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete: () => Promise<void> = async () => {
    if (carIdToDelete == null) return;
    dispatch(setLoading(true));
    dispatch(clearError());
    try {
      await deleteCar(carIdToDelete);
      dispatch(setCars(cars.filter((c) => c.id !== carIdToDelete)));
      setShowDeleteConfirm(false);
      setCarIdToDelete(null);
    } catch {
      dispatch(setError("Unable to delete car."));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCloseConfirm = () => {
    setShowDeleteConfirm(false);
    setCarIdToDelete(null);
  };

  if (!isAuthenticated) return null;

  if (loading && cars.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#70FFE2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!loading && !error && cars.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-20">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-2xl font-semibold text-white mb-2">No cars yet</h2>
          <p className="text-slate-400 mb-6">Add one by clicking the button below.</p>
          <button
            className="px-6 py-3 bg-[#70FFE2] hover:bg-[#5ee6cb] text-slate-900 font-bold rounded-xl transition-all"
            onClick={() => navigate("/cars/new")}
          >
            Create new ad
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">
              My <span className="text-[#70FFE2]">Cars</span>
            </h1>
            <p className="text-slate-400">
              Manage your listings ({cars.length} {cars.length === 1 ? "ad" : "ads"})
            </p>
          </div>
          <button
            className="px-6 py-3 bg-[#70FFE2] hover:bg-[#5ee6cb] text-slate-900 font-bold rounded-xl transition-all"
            onClick={() => navigate("/cars/new")}
          >
            + Create New Ad
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onDeleteClick={handleDeleteClick}
              showDeletebutton={true}
            />
          ))}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Car"
        message="Are you sure you want to delete this car?"
        onConfirmClick={() => void handleConfirmDelete()}
        onClose={handleCloseConfirm}
      />
    </div>
  );
}

export default MyCars;
