import { Check, ChevronDown, ListOrdered } from "lucide-react";
import { useState } from "react";

interface CarFilterProps{
    value: string,
    onChange: (value: string) => void
}
const sortOptions = [
    { id: 'None', label: 'None'},
    { id: 'Newest', label: 'Newest'},
    { id: 'PriceAsc', label: 'PriceAsc'},
    { id: 'PriceDesc', label: 'PriceDesc'},
    { id: 'YearDesc', label: 'YearDesc'},
];

export default function SortedCars({value, onChange} : CarFilterProps){
    const [isOpen, setIsOpen] = useState(false);

    const currentLabel = sortOptions.find(opt => opt.id === value)?.label || 'Sort';
 
    return (
    <div className="relative inline-block text-left w-64 mb-3">
      {/* Главният бутон */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2.5 bg-slate-800 text-white border border-slate-700 rounded-xl hover:border-slate-500 transition-all focus:ring-2 focus:ring-blue-500/50"
      >
        <div className="flex items-center gap-2">
          <ListOrdered size={18} className="text-blue-400" />
          <span className="text-sm font-medium">{currentLabel}</span>
        </div>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Падащото меню */}
      {isOpen && (
        <>
          {/* Overlay за затваряне при клик извън менюто */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          
          <div className="absolute right-0 z-20 mt-2 w-full bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="py-1">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-colors
                    ${value === option.id 
                      ? 'bg-blue-600/10 text-blue-400' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                >
                  {option.label}
                  {value === option.id && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}