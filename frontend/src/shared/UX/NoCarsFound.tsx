import { LuSearchX, LuFilter } from "react-icons/lu";

interface NoCarsFoundProps {
    onOpenFilters: () => void;
    onResetFilters: () => void;
}

export function NoCarsFound({ onOpenFilters, onResetFilters }: NoCarsFoundProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-800">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
                <LuSearchX size={64} className="relative text-slate-500" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
                No cars found
            </h3>
            <p className="text-slate-400 mb-8 max-w-sm">
                We found nothing that matches the current filters.
                Try changing the criteria or resetting your search.</p>

            <div className="flex flex-wrap gap-4 justify-center">
                <button
                    onClick={onOpenFilters}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-semibold transition-all active:scale-95 shadow-lg shadow-blue-900/20"
                >
                    <LuFilter size={18} />
                    Change filters
                </button>

                <button
                    onClick={onResetFilters}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-semibold transition-all"
                >
                    Clear all
                </button>
            </div>
        </div>
    );
}