import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface YearRangeProps {
  value: {min: string, max: string};
  onFilterChange: (range: { min: string; max: string }) => void;
}

const YearRangeFilter = ({value,  onFilterChange }: YearRangeProps) => {
  const minLimit = 1900;
  const maxLimit = 2026

const currentRange : [number, number] = [
    value.min ? parseInt(value.min) : minLimit,
    value.max ? parseInt(value.max) : maxLimit,
];

const handleUpdate = (val: number | number[]) => {
    if (Array.isArray(val)) {
      onFilterChange({
        min: val[0].toString(),
        max: val[1].toString()
      });
    }
  };
  return (
    <div className="flex flex-col gap-3 min-w-[240px] bg-slate-800/80 p-5 rounded-2xl border border-slate-700">
      <div className="flex justify-between items-center">
        <span className="text-[11px] uppercase font-bold text-slate-500">Year Range</span>
        <span className="text-xs font-mono text-[#70FFE2] bg-slate-900 px-2 py-0.5 rounded">
          {currentRange[0]} - {currentRange[1]}
        </span>
      </div>

      <div className="py-4">
        <Slider
          range
          min={minLimit}
          max={maxLimit}
          value={currentRange} 
          onChange={handleUpdate}
          styles={{
            track: { backgroundColor: "#70FFE2" },
            rail: { backgroundColor: "#1e293b" },
            handle: { borderColor: "#70FFE2", backgroundColor: "#0f172a" }
          }}
        />
      </div>
    </div>
  );
};

export default YearRangeFilter;