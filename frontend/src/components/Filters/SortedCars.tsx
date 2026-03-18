import { useState, useRef, useEffect } from 'react';
import { LuArrowUpDown, LuCheck, LuChevronDown } from 'react-icons/lu';

interface SortOption {
  id: string;
  label: string;
}

const sortOptions: SortOption[] = [
  { id: 'None', label: 'Sort by' },
  { id: 'Newest', label: 'Newest' },
  { id: 'PriceAsc', label: 'Price: Asc'},
  { id: 'PriceDesc', label: 'Price: Dsc'},
  { id: 'YearDesc', label: 'Year' },
];

interface SortedCarsProps {
  value: string;
  onChange: (val: string) => void;
}

export default function SortedCars({ value, onChange }: SortedCarsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLabel = sortOptions.find(opt => opt.id === value)?.label || 'Sort by';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all duration-200
          ${isOpen 
            ? 'bg-slate-800 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)] text-white' 
            : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 text-slate-300'
          }
        `}
      >
        <LuArrowUpDown size={18} className={isOpen ? 'text-blue-400' : 'text-slate-400'} />
        <span className="text-sm font-medium whitespace-nowrap">{currentLabel}</span>
        <LuChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-400' : 'text-slate-500'}`} 
        />
      </button>

      {isOpen && (
        <div className="relative right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-[150] overflow-hidden animate-in fade-in zoom-in duration-150">
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-4 py-3 text-sm transition-colors
                  ${value === option.id 
                    ? 'bg-blue-600/10 text-blue-400 font-semibold' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                {option.label}
                {value === option.id && <LuCheck size={16} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}