import type { Car } from "@autovibe/app-state";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../../utils/getImageUrl";

type Props = { car: Car };

export function UserListingMiniCard({ car }: Props) {
  const navigate = useNavigate();

  return (
    <div className="group relative bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden hover:border-[#70FFE2]/40 transition-all duration-300 shadow-lg flex flex-col">
      <button
        type="button"
        className="relative h-36 bg-slate-700 overflow-hidden w-full text-left"
        onClick={() => navigate(`/cars/${car.id}`)}
      >
        {car.imageUrls && car.imageUrls.length > 0 ? (
          <img
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            src={getImageUrl(car.imageUrls[0])}
            alt={`${car.make} ${car.model}`}
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/150";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
            <span className="text-slate-500 text-xs">No image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 to-transparent pointer-events-none" />
        <span className="absolute top-2 left-2 z-10 bg-slate-900/80 text-[#70FFE2] text-[10px] font-bold px-2 py-1 rounded-full border border-slate-700">
          {car.year}
        </span>
      </button>

      <div className="p-3 flex flex-col flex-1 gap-2">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-white truncate group-hover:text-[#70FFE2] transition-colors">
              {car.make}
            </h2>
            <p className="text-slate-400 text-xs font-medium truncate">{car.model}</p>
          </div>
          <p className="text-[#70FFE2] text-sm font-black shrink-0">
            €{car.price.toLocaleString()}
          </p>
        </div>
        <p className="text-slate-500 text-[11px] leading-snug line-clamp-2 flex-1">
          {car.shortDescription || "—"}
        </p>
        <button
          type="button"
          className="w-full px-2 py-1.5 bg-slate-700/80 hover:bg-slate-600 text-white text-[11px] font-bold rounded-lg transition-all"
          onClick={() => navigate(`/cars/${car.id}`)}
        >
          Details
        </button>
      </div>
    </div>
  );
}
