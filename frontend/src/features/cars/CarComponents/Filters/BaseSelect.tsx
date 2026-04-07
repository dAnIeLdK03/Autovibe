import React from "react";

interface Option {
    label: string;
    value: string;
}

interface BaseSelectProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    options: Option[];
    variant?: 'grid' | 'dropdown';
}

export const BaseSelect = ({ label, options, value, onChange, variant = 'grid' }: BaseSelectProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const selectedLabel = options.find(opt => opt.value === value)?.label || ` ${label}`;

    if (variant === 'grid') {
        return (
            <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
                <div className="grid grid-cols-2 gap-2">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => onChange(opt.value)}
                            className={`py-3 px-4 rounded-2xl text-sm font-semibold transition-all border 
                            ${value === opt.value ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 relative">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white text-sm"
            >
                {selectedLabel}
                <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-slate-900 border border-slate-800 rounded-2xl z-[100] shadow-xl overflow-hidden">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => { onChange(opt.value); setIsOpen(false); }}
                            className="w-full text-left px-4 py-3 text-sm hover:bg-slate-800 text-slate-300"
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};