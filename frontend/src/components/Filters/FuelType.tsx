import { Check, ChevronDown, ListOrdered } from 'lucide-react';
import { useState } from 'react'

interface FuelTypeProps {
  value: string,
  onChange: (value: string) => void
}

const fuelTypeOptions = [
  {id: 'All', label: 'All'},
  {id: 'Petrol', label:'Petrol'},
  {id: 'Diesel', label:'Diesel'},
  {id: 'Hybrid', label:'Hybrid'},
];

export default function FuelType({value, onChange}: FuelTypeProps) {

  const [isOpen, setIsOpen] = useState(false);
  const currentOption = fuelTypeOptions.find((opt) => opt.id === value)?.label || "All";

  return (
     <div className="relative inline-block text-left w-64 mb-3">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="ml-2 flex items-center justify-between w-full px-4 py-2.5 bg-slate-800 text-white border border-slate-700 rounded-xl hover:border-slate-500 transition-all focus:ring-2 focus:ring-blue-500/50 relative z-30"
      >
        <div className="flex items-center gap-2">
          <ListOrdered size={18} className="text-blue-400" />
          <span className="text-sm font-medium">{currentOption}</span>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[100] bg-transparent cursor-default" 
            onClick={() => setIsOpen(false)}
          />
          
          <div 
            className="absolute right-0 z-[110] mt-2 w-full bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-1">
              {fuelTypeOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onChange(option.id); 
                    setIsOpen(false); 
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-colors
                    ${value === option.id 
                      ? 'bg-blue-600/20 text-blue-400' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                >
                  <span>{option.label}</span>
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
