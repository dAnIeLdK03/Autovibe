import type { SortedCarsProps } from "../../services/carOptions";
import SortedCars from "./SortedCars";




export const SortModal = ({ isOpen, onClose, sortOptionId, updateSort, onApply }: SortedCarsProps) => {
    if (!isOpen) return null;

   return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-slate-900 w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-slate-800">
                
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-white">Sort Options</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 bg-slate-900">
                    <div className="space-y-4">
                        <SortedCars
                            value={sortOptionId}
                            onChange={(val: string) => updateSort('sortType', val)}
                        />
                    </div>
                </div>

                <div className="p-6 bg-slate-900 border-t border-slate-800">
                    <button
                        onClick={onApply}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20 text-xl"
                    >
                        Show Sorting
                    </button>
                </div>
            </div>
        </div>
    );
};