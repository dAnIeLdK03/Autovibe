import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../stores/store';
import { getCars } from '../services/carsService';
import { setCars, setLoading, setError, clearError} from '../stores/carsSlice';
import Pagination from '../components/pagePagination';
import CarCard from '../components/Car/CarCard';
import LoadingSpinner from '../components/UX/LoadingSpinner';
import EmptyState from '../components/UX/EmptyState';
import SortedCars from '../components/Car/SortedCars';
import FuelType from '../components/Filters/FuelType';
import YearRangeFilter from '../components/Filters/YearRangeFilter';
import Transmission from '../components/Filters/Transmission';
import Mileage from '../components/Filters/Mileage';
import matchesFilters from './Helpers/matchFilters';




function CarList() {
  const dispatch = useDispatch();
  const { cars, loading, error } = useSelector((state: RootState) => state.cars);
  const [fuelType, setFuelType] = useState("Fuel");
  const [transmission, setTransmission] = useState("Transmission");
  const [sortType, setSortType] = useState("None");
  const [mileageFilter, setMileageFilter] = useState("Mileage");


 const filteredCars = cars.filter((car) => 
    matchesFilters(car, {fuelType, transmission, mileageFilter})
  );

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [yearFilters, setYearFilters] = useState({ min: "", max: "" });
  const [debouncedFilters, setDebouncedFilters] = useState(yearFilters);

  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortType) {
      case 'Newest':
        return b.id - a.id;
      case 'None':
        return 0;
      case 'PriceAsc':
        return a.price - b.price;
      case 'PriceDesc':
        return b.price - a.price;
      case 'YearDesc':
        return b.year - a.year;
      default:
        return 0;

    }
  });
  const handleFilterChange = (newRange: { min: string; max: string }) => {
    setYearFilters(newRange);
    setPage(1);
  }

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedFilters(yearFilters)
      }, 1000)
      return () => clearTimeout(handler)
    }, [yearFilters])

    useEffect(() => {
      if (page === undefined || page === null) return;

      const fetchCars = async () => {
        dispatch(setLoading(true));
        dispatch(clearError());

        try {
          const min = debouncedFilters.min ? parseInt(debouncedFilters.min) : undefined;
          const max = debouncedFilters.max ? parseInt(debouncedFilters.max) : undefined;
          const response = await getCars(page, 9, min, max);
          dispatch(setCars(response.items ?? []));
          setTotalPages(response.totalPages ?? 0);
        } catch {
          dispatch(setError("Unable to load cars."));
        } finally {
          dispatch(setLoading(false));
        }
      };
      fetchCars();
    }, [page, dispatch, debouncedFilters])

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
      return (
        <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-20">
          <div className="max-w-7xl mx-auto bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6">
            {error}
          </div>
        </div>
      );
    }

    if (!loading && !error && cars.length === 0) {
      return (
        <EmptyState />
      );
    }

    return (
      <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-20">
        <div className="max-w-7xl mx-auto">

          <div className="mb-12 text-center">
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">
              Explore Our <span className="text-[#70FFE2]">Fleet</span>
            </h1>
            <p className="text-slate-400">Discover the perfect ride for your next journey.</p>

          </div>

          <div className="flex items-center gap-3 mb-4"> 

            <span className="text-slate-400 text-sm font-medium whitespace-nowrap ml-2">
              Fuel type
            </span>
            <FuelType
              value={fuelType}
              onChange={(val) => setFuelType(val)}
            />

             <span className="text-slate-400 text-sm font-medium whitespace-nowrap ml-2">
              Transmission
            </span>
            <Transmission
              value={transmission}
              onChange={(val) => setTransmission(val)}
            />

             <span className="text-slate-400 text-sm font-medium whitespace-nowrap ml-2">
              Mileage
            </span>
            <Mileage
              value={mileageFilter}
              onChange={(val) => setMileageFilter(val)}
            />

            <div className="flex items-center gap-3 mb-4">
              <span className="text-slate-400 text-sm font-medium whitespace-nowrap ml-2">
                Sort by:
              </span>
              <SortedCars
                value={sortType}
                onChange={(val) => setSortType(val)}
              />
            </div>


            <div className="flex items-center gap-3 mb-4">
              <span className="text-slate-400 text-sm font-medium whitespace-nowrap ml-2">
                Year:
              </span>
              <YearRangeFilter
                value={yearFilters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedCars.map((car) => (
              <CarCard key={car.id} car={car} showDeletebutton={false} />
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
      </div>
    );
  }
export default CarList
