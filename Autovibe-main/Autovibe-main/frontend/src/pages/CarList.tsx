import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../stores/store';
import { getCars } from '../services/carsService';
import { setCars, setLoading, setError, clearError } from '../stores/carsSlice';
import Pagination from '../components/pagePagination';
import CarCard from '../components/Car/CarCard';

function CarList() {
  const dispatch = useDispatch();
  const { cars, loading, error } = useSelector((state: RootState) => state.cars);
  const [fuelType, setFuelType] = useState("All");
  const [sortType, setSortType] = useState("None");
  const filteredCars = cars.filter((car) =>
    fuelType === "All" || car.fuelType === fuelType
  );

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

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
  useEffect(() => {
    if(page === undefined || page === null) return;
    
    const fetchCars = async () => {
      dispatch(setLoading(true));
      dispatch(clearError());

      try {
        const response = await getCars(page, 9);
        dispatch(setCars(response.items ?? []));
        setTotalPages(response.totalPages ?? 0);
      } catch {
        dispatch(setError("Unable to load cars."));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchCars();
  }, [page, dispatch])

  if (loading) {
    return (<div className="flex justify-center">
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin">
        <svg className="animate-spin h-6 w-6 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-600">No cars yet</h2>
        <p className="text-gray-500 mt-2">Add one by clicking the button belows.</p>

        
      </div>
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

        <div className="relative group max-w-xs">
          <label className="block text-slate-400 text-sm font-medium mb-1.5 text-white ml-2">
            Fuel type
          </label>
          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            className="block w-full text-left px-4 py-3 text-sm text-slate-900 hover:bg-slate-700 hover:text-[#70FFE2] transition-colors border-b border-slate-700/50 last:border-0"
          >
            <option value="All" >All Types</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <label className="block text-slate-400 text-sm font-medium mb-1.5 text-white mt-2 ml-2">
            Sort by
          </label>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="block w-full text-left px-4 py-3 text-sm text-slate-900 hover:bg-slate-700 hover:text-[#70FFE2] transition-colors border-b border-slate-700/50 last:border-0 mb-6"
            >
            <option value="None">None</option>
            <option value='Newest'>Newest</option>
            <option value="PriceAsc">PriceAsc</option>
            <option value="PriceDesc">PriceDesc</option>
            <option value="YearDesc">YearDesc</option>
          </select>
        </div>

        {/* Cars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedCars.map((car) => (
            <CarCard key={car.id} car={car} showDeletebutton={false} />
          ))}
        </div>
        {/* Pagination */}
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
