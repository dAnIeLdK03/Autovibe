import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { CarCardProps } from '../services/carsService';


const CarCard: React.FC<CarCardProps> = ({ car, onDeleteClick, showDeletebutton }) => {
  const navigate = useNavigate();
  const showDeleteBtn = showDeletebutton === true;

  return (
            
            <div
              key={car.id}
              className="group relative bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700 overflow-hidden hover:border-[#70FFE2]/50 transition-all duration-500 shadow-2xl flex flex-col"
            >

              <div className="relative h-56 bg-slate-700 overflow-hidden">
                {car.imageUrls && car.imageUrls.length > 0 ? (
                  <img
                    className="w-full h-full object-cover"
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

                <div className="mt-auto flex flex-wrap gap-2 pt-4 border-t border-slate-700/50">
                    <button
                    className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition-all"
                    onClick={() => navigate(`/cars/${car.id}`)}
                  >
                    Details
                  </button>

                  {showDeleteBtn && ( 
                    <button

                    className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-all"
                    onClick={() => onDeleteClick?.(car.id)}
                  >
                    Delete
                  </button>
                  )}
                </div>
              </div>
            </div>
  )
};

export default CarCard