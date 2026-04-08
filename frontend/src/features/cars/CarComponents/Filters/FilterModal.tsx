import { type CarFilters } from '../../../../api/carsService';
import YearRangeFilter from './YearRangeFilter';
import { Power } from './Power';
import { Location } from './Location';
import { BaseSelect } from './BaseSelect';
import { bodyTypes, fuelTypeOptions, MileagеTypes, transmissionTypes, wheelTypes } from '../../../../api/carOptions';
import { useEffect, useState } from 'react';
import { initialFilters } from '../../CarList';

interface FilterProps {
    isOpen: boolean;
    onClose: () => void;
    filters: CarFilters;
    onApply: (finalFilters: CarFilters) => void;
};

export const FilterModal = ({ isOpen, onClose, filters, onApply }: FilterProps) => {
    const [tempFilters, setTempFilters] = useState<CarFilters>(filters);

    const handleReset = () => {
        setTempFilters(initialFilters);
    }
    useEffect(() => {
        if (isOpen) {
            setTempFilters(filters);
        }
    }, [isOpen, filters]);

    if (!isOpen) return null;

    const localUpdate = <K extends keyof CarFilters>(key: K, value: CarFilters[K]) => {
        setTempFilters(prev => {
            const isSameValue = prev[key] === value;

            return {
                ...prev,
                [key]: isSameValue ? "" : value
            };
        });
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative z-10 bg-slate-950 border border-slate-800/60 w-full max-w-2xl rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header... */}

                <div className="p-8 overflow-y-auto custom-scrollbar flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 space-y-6">
                            <BaseSelect
                                label='Transmission'
                                value={tempFilters.transmission ?? ""}
                                options={transmissionTypes}
                                onChange={(val) => localUpdate('transmission', val)}
                            />
                            <div className="h-px bg-slate-800/50" />
                            <BaseSelect
                                label='Body Type'
                                value={tempFilters.bodyType ?? ""}
                                options={bodyTypes}
                                onChange={(val) => localUpdate('bodyType', val)}
                            />
                            <BaseSelect
                                label='Steering Wheel'
                                value={tempFilters.steeringWheel ?? ""}
                                options={wheelTypes}
                                onChange={(val) => localUpdate('steeringWheel', val)}
                            />
                        </div>

                        <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 space-y-6 flex flex-col">
                            <BaseSelect
                                label='Fuel Type'
                                value={tempFilters.fuelType ?? ""}
                                options={fuelTypeOptions}
                                onChange={(val) => localUpdate('fuelType', val)}
                            />
                            <div className="h-px bg-slate-800/50" />
                            <BaseSelect
                                label='Mileage'
                                value={tempFilters.mileage ?? ""}
                                options={MileagеTypes}
                                onChange={(val) => localUpdate('mileage', val)}
                            />
                        </div>

                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 ">
                            <div className="pt-8 bg-slate-900/40 p-3 rounded-3xl border border-slate-800/50 space-y-6">
                                <Power
                                    value={tempFilters.power ?? ""}
                                    onChange={(val) => localUpdate('power', val)}
                                />
                                <Location
                                    value={tempFilters.location ?? ""}
                                    onChange={(val) => localUpdate('location', val)}
                                />
                            </div>

                            <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 hover:border-blue-500/30 transition-colors">
                                <YearRangeFilter
                                    value={tempFilters.yearRange}
                                    onFilterChange={(newRange) =>
                                        localUpdate('yearRange', newRange)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-900/90 border-t border-slate-800/50 shrink-0">
                    <div className="flex flex-row gap-3">

                        <button
                            onClick={handleReset}
                            className="flex-1 group relative bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] overflow-hidden border border-slate-700"
                        >
                            <span className="relative z-10 text-lg">Clear</span>
                        </button>

                        <button
                            onClick={() => onApply(tempFilters)}
                            className="flex-[2] group relative bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] overflow-hidden shadow-lg shadow-blue-900/20"
                        >
                            <span className="relative z-10 text-lg">Show results</span>
                            <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700" />
                        </button>

                    </div>
                </div>

            </div>
        </div>
    );
}