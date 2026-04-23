import { useState } from 'react';
import { theme } from '../theme';

interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  value?: [number, number];
  onChange?: (value: [number, number]) => void;
}

export function RangeSlider({ label, min, max, step = 1, unit = '', value, onChange }: RangeSliderProps) {
  const [internalValue, setInternalValue] = useState<[number, number]>([min, max]);
  const currentValue = value ?? internalValue;
  const [lo, hi] = currentValue;

  const handleChange = (newValue: [number, number]) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  const handleLowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLo = Math.min(Number(e.target.value), hi - step);
    handleChange([newLo, hi]);
  };

  const handleHighChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHi = Math.max(Number(e.target.value), lo + step);
    handleChange([lo, newHi]);
  };

  const loPercent = ((lo - min) / (max - min)) * 100;
  const hiPercent = ((hi - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-sm text-gray-900">{label}</p>
        <span className="text-xs font-medium text-gray-700">
          {lo}{unit ? ` ${unit}` : ''} – {hi}{unit ? ` ${unit}` : ''}
        </span>
      </div>
      {/* Track container: 20px tall to fit the 20px thumbs */}
      <div className="relative h-5">
        {/* Background track: 8px tall, vertically centered (top = (20-8)/2 = 6px) */}
        <div className="absolute top-1.5 left-0 right-0 h-2 bg-gray-200 rounded-lg" />
        {/* Filled track */}
        <div
          className="absolute top-1.5 h-2 rounded-lg"
          style={{
            left: `${loPercent}%`,
            right: `${100 - hiPercent}%`,
            backgroundColor: theme.colors.accent,
            opacity: 0.4,
          }}
        />
        {/* Low thumb: top=0 so the 20px thumb is centered on the 8px track */}
        <input
          type="range"
          min={min}
          max={max}
          value={lo}
          step={step}
          onChange={handleLowChange}
          className="range-thumb absolute top-0 left-0 w-full h-5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
        />
        {/* High thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={hi}
          step={step}
          onChange={handleHighChange}
          className="range-thumb absolute top-0 left-0 w-full h-5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min}{unit ? ` ${unit}` : ''}</span>
        <span>{max}{unit ? ` ${unit}` : ''}</span>
      </div>
      <style>{`
        .range-thumb::-webkit-slider-thumb {
          background-color: ${theme.colors.accent};
        }
        .range-thumb::-moz-range-thumb {
          background-color: ${theme.colors.accent};
        }
      `}</style>
    </div>
  );
}
