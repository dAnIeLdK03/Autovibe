import { type CarFilters } from '../../../../api/carsService';
import YearRangeFilter from './YearRangeFilter';
import { Power } from './Power';
import { Location } from './Location';
import { BaseSelect } from './BaseSelect';
import { bodyTypes, fuelTypeOptions, MileagеTypes, transmissionTypes, wheelTypes } from '../../../../api/carOptions';

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
            <div
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            <div className="relative z-10 bg-slate-950 border border-slate-800/60 w-full max-w-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 max-h-[90vh]">

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 space-y-6">
                            <BaseSelect
                                label='Transmission'
                                value={filters.transmission ?? ""}
                                options={transmissionTypes}
                                onChange={(val) => updateFilter('transmission', val)}
                            />
                            <div className="h-px bg-slate-800/50" />
                            <BaseSelect
                                label='Body Type'
                                value={filters.bodyType ?? ""}
                                options={bodyTypes}
                                onChange={(val) => updateFilter('bodyType', val)}
                            />
                            <div className="h-px bg-slate-800/50" />
                            <BaseSelect
                                label='Steering Wheel'
                                value={filters.steeringWheel ?? ""}
                                options={wheelTypes}
                                onChange={(val) => updateFilter('steeringWheel', val)}
                            />
                        </div>

                        <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 space-y-6 flex flex-col">
                            <BaseSelect
                                label='Fuel Type'
                                value={filters.fuelType ?? ""}
                                options={fuelTypeOptions}
                                onChange={(val) => updateFilter('fuelType', val)}
                            />
                            <div className="h-px bg-slate-800/50" />
                            <BaseSelect
                                label='Mileage'
                                value={filters.mileage ?? ""}
                                options={MileagеTypes}
                                onChange={(val) => updateFilter('mileage', val)}
                            />
                        </div>

                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 ">
                            <div className="pt-8 bg-slate-900/40 p-3 rounded-3xl border border-slate-800/50 space-y-6">
                                <Power
                                    value={filters.power ?? ""}
                                    onChange={(val) => updateFilter('power', val)}
                                />
                                <Location
                                    value={filters.location ?? ""}
                                    onChange={(val) => updateFilter('location', val)}
                                />
                            </div>

                            <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 hover:border-blue-500/30 transition-colors">
                                <YearRangeFilter
                                    value={filters.yearRange}
                                    onFilterChange={(newRange) =>
                                        updateFilter('yearRange', newRange)
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