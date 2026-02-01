import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../stores/store';
import { getCars } from '../services/carsService';
import { setCars, setLoading, setError, clearError } from '../stores/carsSlice';  
import { useNavigate } from 'react-router-dom';


function CarList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cars, loading, error } = useSelector((state: RootState) => state.cars);
  const {isAuthenticated} = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    const fetchCars = async() =>{
      dispatch(setLoading(true));
      dispatch(clearError());
      try{
        const data = await getCars();
        dispatch(setCars(data));
      }catch{
        dispatch(setError("Unable to load cars."));
      }finally{
        dispatch(setLoading(false));
      }
    }
    fetchCars();
  }, [])

  if(loading){
    return <h2>Loading...</h2>
  }
  if(error){
    return <h2>{error}</h2>
  }
  
  if(!loading && !error && cars.length === 0){
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-gray-100 p-6 rounded-full mb-4">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-gray-600">No cars yet</h2>
      <p className="text-gray-500 mt-2">Add one by clicking the button belows.</p>

      <button className="px-5 py-2.5 bg-slate-700 hover:bg-[#70FFE2] text-white hover:text-slate-900 font-bold rounded-xl transition-all duration-300 text-sm shadow-lg mt-3" onClick={() => isAuthenticated? navigate(`/cars/new`) : navigate("/login")}>
            {isAuthenticated? "Create new ad" : "Login to create new ad"}
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
          <button className="px-5 py-2.5 bg-slate-700 hover:bg-[#70FFE2] text-white hover:text-slate-900 font-bold rounded-xl transition-all duration-300 text-sm shadow-lg mt-3" onClick={() => isAuthenticated? navigate(`/cars/new`) : navigate("/login")}>
            {isAuthenticated? "Create new ad" : "Login to create new ad"}
          </button>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div 
              key={car.id} 
              className="group relative bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700 overflow-hidden hover:border-[#70FFE2]/50 transition-all duration-500 shadow-2xl flex flex-col"
            >
              <div className="relative h-56 bg-slate-700 overflow-hidden">
                {car.imageUrls && car.imageUrls.length > 0 ? (
                  <img 
                    src={`http://localhost:5258${car.imageUrls[0]}`} 
                    alt={`${car.make} ${car.model}`} 
                    className="w-full h-full object-cover object-center"
                    onError={() => {
                      console.error("Image failed to load:", car.imageUrls?.[0]);
                      console.error("Full URL:", `http://localhost:5258${car.imageUrls?.[0]}`);
                    }}
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
