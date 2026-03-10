import { useState } from "react"
import { fuelTypeOptions } from "./Filters/FuelType"
import type { FuelTypeProps } from "./Filters/FuelType";

const FuelSelector = ({ value, onChange }: FuelTypeProps) => {
    const [isOpen, setIsOpen] = useState(false);


    return (
        <div className=" mb-3 w-full border border-slate-700 rounded-2xl transition-all duration-300 bg-slate-900/50">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="text-base flex items-center justify-between w-full px-5 py-4 text-sm text-white outline-none"            >
                <span>{value || "Fuel"}</span>
                <svg
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#70FFE2]' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="relative z-10 w-full mt-2 bg-slate-800 border rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
                    <div className="py-1">
                        {fuelTypeOptions.map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => {
                                    onChange(option.id);
                                    setIsOpen(false);
                                }}
                                className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-colors
                    ${value === option.id
                                        ? 'bg-blue-600/20 text-blue-400'
                                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    }`}
                            >
                                {option.label}
                                {value === option.id && (
                                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FuelSelector