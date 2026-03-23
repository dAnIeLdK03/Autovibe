import { type CarFilters } from '../../services/carsService';
import Transmission from './Transmission'
import FuelType from './FuelType';
import Mileage from './Mileage';
import YearRangeFilter from './YearRangeFilter';
import { Power } from './Power';

interface FilterProps {
    isOpen: boolean;
    onClose: () => void;
    filters: CarFilters;
    updateFilter: (key: string, value: any) => void;
    onApply: () => void;
};

export const FilterModal = ({ isOpen, onClose, filters, updateFilter, onApply }: FilterProps) => {
    if (!isOpen) return null; 

    return (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />

                <div className="relative z-10 bg-slate-950 border border-slate-800 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">

                    <div className="p-6 border-b border-slate-900 flex justify-between items-center bg-slate-900/50">
                        <h2 className="text-xl font-bold text-white tracking-tight">Filters</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh] custom-scrollbar">

                        <div className="space-y-3">
                            <FuelType
                                value={filters.fuelType}
                                onChange={(val) => updateFilter('fuelType', val)}
                            />
                        </div>

                        <div className="space-y-3">
                            <Transmission
                                value={filters.transmission}
                                onChange={(val) => updateFilter('transmission', val)}
                            />
                        </div>

                        <div className="space-y-3">
                            <Mileage
                                value={filters.mileage}
                                onChange={(val) => updateFilter('mileage', val)}
                            />
                        </div>
                        <div className="space-y-3">
                            <Power
                                value={filters.power}
                                onChange={(val) => updateFilter('power', val)}
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                                <YearRangeFilter
                                    value={filters.yearRange}
                                    onFilterChange={(newRange) => updateFilter('yearRange', newRange)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-900/80 border-t border-slate-900">
                        <button
                            onClick={onApply}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20 text-lg"
                        >
                            Show results
                        </button>
                    </div>
                </div>
            </div >
    );
}
