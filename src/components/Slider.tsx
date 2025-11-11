import { useState } from 'react';

interface SliderProps {
  label: string;
  min: number;
  max: number;
  defaultValue?: number;
  step?: number;
  unit?: string;
}

export function Slider({ label, min, max, defaultValue = min, step = 1, unit = '' }: SliderProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-base text-gray-500 tracking-wider uppercase">{label}</p>
        <span className="font-semibold text-sm text-[#0b223b] bg-gray-100 px-2 py-1 rounded">
          {value}{unit}
        </span>
      </div>
      <div className="relative pt-2">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          step={step}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0b223b]"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );
}
