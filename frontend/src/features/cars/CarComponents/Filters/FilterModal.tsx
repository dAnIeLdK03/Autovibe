import { type CarFilters } from '../../../../api/carsService';
import Transmission from './Transmission'
import FuelType from './FuelType';
import Mileage from './Mileage';
import YearRangeFilter from './YearRangeFilter';
import { Power } from './Power';
import BodyType from './BodyType';
import SteeringWheel from './SteeringWheel';
import { Location } from './Location';

interface FilterProps {
    isOpen: boolean;
    onClose: () => void;
    filters: CarFilters;
    updateFilter: (key: string, value: string | CarFilters['yearRange']) => void;
    onApply: () => void;
};

export const FilterModal = ({ isOpen, onClose, filters, updateFilter, onApply }: FilterProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative z-10 bg-slate-950 border border-slate-800/60 w-full max-w-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 max-h-[90vh]">
                
                {/* Header - Fixed */}
                <div className="px-8 py-6 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/30 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Filters</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar bg-gradient-to-b from-transparent to-slate-900/10 flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <FuelType
                                value={filters.fuelType ?? ""}
                                onChange={(val) => updateFilter('fuelType', val)}
                            />
                            <Transmission
                                value={filters.transmission ?? ""}
                                onChange={(val) => updateFilter('transmission', val)}
                            />
                            <Mileage
                                value={filters.mileage ?? ""}
                                onChange={(val) => updateFilter('mileage', val)}
                            />
                        </div>

                        <div className="space-y-6">
                            <BodyType
                                value={filters.bodyType ?? ""}
                                onChange={(val) => updateFilter('bodyType', val)}
                            />
                            <SteeringWheel
                                value={filters.steeringWheel ?? ""}
                                onChange={(val) => updateFilter('steeringWheel', val)}
                            />
                            <Power
                                value={filters.power ?? ""}
                                onChange={(val) => updateFilter('power', val)}
                            />
                        </div>

                        <div className="md:col-span-2 pt-4 space-y-6">
                            <hr className="border-slate-800/50" />
                            <Location
                                value={filters.location ?? ""}
                                onChange={(val) => updateFilter('location', val)}
                            />
                            <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 hover:border-blue-500/30 transition-colors">
                                <YearRangeFilter
                                    value={filters.yearRange}
                                    onFilterChange={(newRange) =>
                                        updateFilter('yearRange', newRange as CarFilters['yearRange'])
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-900/90 border-t border-slate-800/50 backdrop-blur-md shrink-0">
                    <button
                        onClick={onApply}
                        className="group relative w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] overflow-hidden shadow-lg shadow-blue-900/20"
                    >
                        <span className="relative z-10 text-lg">Show results</span>
                        <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700" />
                    </button>
                </div>
            </div>
        </div>
    );
}