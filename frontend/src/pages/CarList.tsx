import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../stores/store';
import { getCars } from '../services/carsService';
import { setCars, setLoading, setError, clearError } from '../stores/carsSlice';
import { useNavigate } from 'react-router-dom';

function CarList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cars, loading, error } = useSelector((state: RootState) => state.cars);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [fuelType, setFuelType] = useState("All");
  const [sortType, setSortType] = useState("None");
  const filteredCars = cars.filter((car) => 
    fuelType === "All" || car.fuelType === fuelType
  );
  const sortedCars = [...filteredCars].sort((a, b) => {
    switch(sortType){
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
  })
  useEffect(() => {
    const fetchCars = async () => {
      dispatch(setLoading(true));
      dispatch(clearError());
      
      try {
        const data = await getCars();
        dispatch(setCars(data));
      } catch {
        dispatch(setError("Unable to load cars."));
      } finally {
        dispatch(setLoading(false));
      }
    }
    fetchCars();
  }, [])

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
    <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6">
            {error}
          </div>
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

        <button className="px-5 py-2.5 bg-slate-700 hover:bg-[#70FFE2] text-white hover:text-slate-900 font-bold rounded-xl transition-all duration-300 text-sm shadow-lg mt-3" onClick={() => isAuthenticated ? navigate(`/cars/new`) : navigate("/login")}>
          {isAuthenticated ? "Create new ad" : "Login to create new ad"}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-20">
      <div className="max-w-7xl mx-auto">

        <div className="mb-12">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Explore Our <span className="text-[#70FFE2]">Fleet</span>
          </h1>
          <p className="text-slate-400">Discover the perfect ride for your next journey.</p>
          <button className="px-5 py-2.5 bg-slate-700 hover:bg-[#70FFE2] text-white hover:text-slate-900 font-bold rounded-xl transition-all duration-300 text-sm shadow-lg mt-3" onClick={() => isAuthenticated ? navigate(`/cars/new`) : navigate("/login")}>
            {isAuthenticated ? "Create new ad" : "Login to create new ad"}
          </button>
        </div>

        <div className="relative group max-w-xs">
          <label className="block text-slate-400 text-sm font-medium mb-1.5 text-white ml-2">
            Fuel type
          </label>
          <select
            value={fuelType} 
            onChange={(e) => setFuelType(e.target.value)}
            className="w-full apperance-none bg-late-800 border border-slate-700 text-slate-200 
            py-2.5 px-4 pr-10 rounded-xl cursor-pointer focus:outline-none
            focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
            transition-all duration-200 hover:bg-slate-750 shadow-lg text-black m-1"
          >
            <option value= "All">All Types</option>
            <option value= "Petrol">Petrol</option>
            <option value= "Diesel">Diesel</option>
            <option value= "Hybrid">Hybrid</option>
          </select>
          
          <label className="block text-slate-400 text-sm font-medium mb-1.5 text-white mt-2 ml-2">
            Sort by
          </label>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="w-full apperance-none bg-late-800 border border-slate-700 text-slate-200 
            py-2.5 px-4 pr-10 rounded-xl cursor-pointer focus:outline-none
            focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
            transition-all duration-200 hover:bg-slate-750 shadow-lg text-black m-1 mb-2"   
          >
            <option value = "None">None</option>
            <option value = 'Newest'>Newest</option>
            <option value = "PriceAsc">PriceAsc</option>
            <option value = "PriceDesc">PriceDesc</option>
            <option value = "YearDesc">YearDesc</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedCars.map((car) => (
            <div
              key={car.id}
              className="group relative bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700 overflow-hidden hover:border-[#70FFE2]/50 transition-all duration-500 shadow-2xl flex flex-col"
            >
              <div className="relative h-56 bg-slate-700 overflow-hidden">
                {car.imageUrls && car.imageUrls.length > 0 ? (
                  <img
                    src={`http://localhost:5258${car.imageUrls[0]}`}
                    alt={`${car.make} ${car.model}`}
                    onError={(e) => e.currentTarget.src = "https://via.placeholder.com/150"}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                    <span className="text-slate-500 text-sm">No image</span>
                  </div>
                )}
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
                    <p className="text-[#70FFE2] text-2xl font-black">
                      €{car.price.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Price</p>
                  </div>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
                  {car.shortDescription || "No description available for this premium vehicle."}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-700/50">
                  <div className="flex space-x-3 text-slate-500 text-xs">
                  </div>

                  <button className="px-5 py-2.5 bg-slate-700 hover:bg-[#70FFE2] text-white hover:text-slate-900 font-bold rounded-xl transition-all duration-300 text-sm shadow-lg" onClick={() => navigate(`/cars/${car.id}`)}>
                    Details
                  </button>
                  <button className="px-5 py-2.5 bg-slate-700 hover:bg-[#70FFE2] text-white hover:text-slate-900 font-bold rounded-xl transition-all duration-300 text-sm shadow-lg" onClick={() => navigate(`/profile`)}>
                    Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CarList
