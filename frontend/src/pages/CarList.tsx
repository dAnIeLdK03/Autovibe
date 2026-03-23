import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../stores/store';
import { getCars, type CarFilters } from '../services/carsService';
import { setCars, setLoading, clearError } from '../stores/carsSlice';
import Pagination from '../components/pagePagination';
import CarCard from '../components/Car/CarCard';
import EmptyState from '../components/UX/EmptyState';
import { SkeletonLoader } from '../components/UX/SkeletonLoader';
import SortedCars from '../components/Filters/SortedCars';
import { LuFilter } from 'react-icons/lu';
import { FilterModal } from '../components/Filters/FilterModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '../Hooks/useDebounce';

const initialFilters: CarFilters = {
  fuelType: "Fuel",
  transmission: "Transmission",
  mileage: "Mileage",
  yearRange: { min: "1900", max: "2026" },
  power: "",
  sortType: "None"
}


function CarList() {
  const dispatch = useDispatch();
  const { cars, loading, error } = useSelector((state: RootState) => state.cars);
  const [sortType, setSortType] = useState("None");
  const [filters, setFilters] = useState<CarFilters>(initialFilters);
  const debounceFilter = useDebounce(filters, 500);



  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);



  const toggleFilters = (isOpen: boolean) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }

  const updateFilter = (key: any, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPage(1)
  };

  const handleApply = () => {
    setIsModalOpen(false);
  }

 


  useEffect(() => {
    if (page === undefined || page === null) return;

    const fetchCars = async () => {
      dispatch(setLoading(true));
      dispatch(clearError());

      try {

        const queryParams : any = {
          ...debounceFilter,
          sortType
        };

        if(!queryParams.power || queryParams.power === "0" || queryParams.toString().trim() === ""){
          delete queryParams.power
        }

        const response = await getCars(page, 9, queryParams);

        dispatch(setCars(response.items ?? []));
        setTotalPages(response.totalPages ?? 0);
      } catch {
        dispatch(setCars([]));
        setTotalPages(0);
      } finally {
        dispatch(setLoading(false));
      }
    };
      fetchCars();
  }, [page, dispatch, sortType, debounceFilter])



  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-5">
        <div className="flex justify-center m-5">
          <SkeletonLoader type="details" count={3} />
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-20">
        <div className="max-w-7xl mx-auto bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6">
          {error}
        </div>
      </div>
    );
  }

  if (!loading && !error && cars.length === null) {
    return (
      <EmptyState />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-20">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Explore Our <span className="text-[#70FFE2]">Fleet</span>
          </h1>
          <p className="text-slate-400">Discover the perfect ride for your next journey.</p>

        </div>
        <div className={`flex items-center gap-3 mb-4 transition-opacity duration-600 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>

          <div className="flex items-center gap-3 mb-4">
            <SortedCars
              value={sortType}
              onChange={(val) => {
                setSortType(val);
                setPage(1);
              }}
            />
          </div>


          <button
            onClick={() => {
              setIsModalOpen(true);
              toggleFilters(true);
            }}
            className={`
    flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all duration-200 mb-4 gap-3
    bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white
    ${isModalOpen ? 'bg-slate-800 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)] text-white' : ''}
  `}
          >
            <LuFilter
              size={18}
              className={`${isModalOpen ? 'text-blue-400' : 'text-slate-400'}`}
            />

            <span className="text-sm font-medium whitespace-nowrap">Filters</span>

          </button>

          <FilterModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              toggleFilters(false);
            }}
            filters={filters}
            updateFilter={updateFilter}
            onApply={() => {
              handleApply();
              toggleFilters(false);
            }}
          />


        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {cars.map((car) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <CarCard
                  key={car.id}
                  car={car}
                  showDeletebutton={false} />
              </motion.div>

            ))}
          </AnimatePresence>
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
    </div>
  );
}
export default CarList
