interface PriceRangeSliderProps {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
}

export const PriceRangeSlider = ({
  min, max, valueMin, valueMax, onChange,
}: PriceRangeSliderProps) => {
  const pctMin = ((valueMin - min) / (max - min)) * 100;
  const pctMax = ((valueMax - min) / (max - min)) * 100;

  return (
    <div className="px-2">
      <div className="flex justify-between text-xs text-white/40 font-bold mb-3">
        <span>MX${valueMin.toLocaleString()}</span>
        <span>MX${valueMax.toLocaleString()}</span>
      </div>
      <div className="relative h-1.5 bg-white/10 rounded-full">
        <div
          className="absolute h-full bg-[#c9a84c] rounded-full"
          style={{ left: `${pctMin}%`, right: `${100 - pctMax}%` }}
        />
        <input type="range" min={min} max={max} value={valueMin}
          onChange={e => onChange(Math.min(+e.target.value, valueMax - 500), valueMax)}
          className="absolute w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: valueMin > max - 100 ? 5 : 3 }}
        />
        <input type="range" min={min} max={max} value={valueMax}
          onChange={e => onChange(valueMin, Math.max(+e.target.value, valueMin + 500))}
          className="absolute w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 4 }}
        />
        {/* Thumbs */}
        <div className="absolute w-4 h-4 bg-[#c9a84c] border-2 border-black rounded-full -mt-[5px] pointer-events-none shadow-lg"
          style={{ left: `calc(${pctMin}% - 8px)` }} />
        <div className="absolute w-4 h-4 bg-[#c9a84c] border-2 border-black rounded-full -mt-[5px] pointer-events-none shadow-lg"
          style={{ left: `calc(${pctMax}% - 8px)` }} />
      </div>
    </div>
  );
};
