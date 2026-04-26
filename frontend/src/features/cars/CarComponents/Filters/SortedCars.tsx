import { Check } from 'lucide-react';
import type { SortSelectProps } from './common';
import { sortOptions } from '../../../../api/carOptions';

export default function SortedCars({ value, onChange }: SortSelectProps) {

  return (
    <div className="flex flex-col gap-2 w-full">
      {sortOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`flex items-center justify-between w-full px-5 py-4 rounded-2xl border-2 transition-all
            ${value === option.id
              ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.1)]'
              : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
        >
          <span className="font-bold text-base">{option.label}</span>
          {value === option.id && <Check size={20} className="text-blue-500" strokeWidth={3} />}
        </button>
      ))}
    </div>
  );
}