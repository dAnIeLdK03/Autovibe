import { useState } from "react";
import type { FilterSelectProps } from "./common"
import { Check, ChevronDown, ListOrdered } from 'lucide-react';


export const MileagеTypes = [
    {id: 'Mileage', label:'Mileage'},
    {id: 'to 10000', label: 'to 10000'},
    {id: 'to 20000', label: 'to 20000'},
    {id: 'to 50000', label: 'to 50000'},
    {id: 'to 100000', label: 'to 100000'},
    {id: 'to 150000', label: 'to 150000'},
    {id: 'to 200000', label: 'to 200000'},
    {id: 'to 250000', label: 'to 250000'},
    {id: 'to 300000', label: 'to 300000'},
    {id: 'over 300000', label: 'over 300000'},
];

function Mileage({value, onChange} : FilterSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const currentOption = MileagеTypes.find((opt) => opt.id === value)?.label || "Mileage";
        
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
                              {MileagеTypes.map((option) => (
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

export default Mileage