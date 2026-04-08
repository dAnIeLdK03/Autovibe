import type { FilterSelectProps } from "./common";


export function Power({value, onChange} : FilterSelectProps){
    return(
       <div className="relative inline-block text-left w-64 mb-3 ml-2">
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-500 transition-all focus-within:ring-2 focus-within:ring-blue-500/50">
                    <input 
                        className="w-full px-3 py-2.5 bg-transparent text-white text-sm font-medium outline-none placeholder:text-slate-500"    
                        type="text"
                        placeholder="Power"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                    />
            </div>
        </div>
    )
}