import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import type { RootState } from "../../stores/store";
import { deleteCar, getCarsByUserId } from "../../api/carsService";
import { setCars, setLoading, setError, clearError } from "../../stores/carsSlice";
import CarCard from "./CarComponents/CarCard"; 
import ConfirmDialog from "../../shared/ConfirmDialog/ConfirmDialog"; 
import EmptyState from "../../shared/UX/EmptyState";
import Pagination from "../../shared/Pagination/pagePagination";
import { SkeletonLoader } from "../../shared/UX/SkeletonLoader";

function MyCars() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { cars, loading, error } = useSelector((state: RootState) => state.cars);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [carIdToDelete, setCarIdToDelete] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      navigate("/login");
      return;
    }
    if(page === undefined || page === null) return;
    
    dispatch(setLoading(true));
    dispatch(clearError());
    const fetchCars = async () => {
      dispatch(setLoading(true));
      dispatch(clearError());
      try {
        const response = await getCarsByUserId(page, 9);
        const allCars = response.items ?? [];
        const myCars = allCars.filter((c) => c.userId === user.id);
        dispatch(setCars(myCars));
        setTotalPages(response.totalPages ?? 0);
      } catch (err: unknown) {
        const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Unable to load your cars.";
        dispatch(setError(msg));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchCars();
  }, [page, user?.id, isAuthenticated, navigate, dispatch]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
       <SkeletonLoader type="details" count={3} />
      </div>
    );
  }
  if(cars.length === 0){
    <EmptyState />
  }

  if (!loading && !error && cars.length === 0) {
    return (
      <EmptyState />
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
        <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage: number) => {
              setPage(newPage);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
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
