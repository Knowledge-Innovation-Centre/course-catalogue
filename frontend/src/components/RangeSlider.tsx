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
    const raw = Number(e.target.value);
    const clamped = Math.max(min, Math.min(raw, hi));
    handleChange([clamped, hi]);
  };

  const handleHighChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);
    const clamped = Math.min(max, Math.max(raw, lo));
    handleChange([lo, clamped]);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <p className="font-semibold text-sm text-gray-500 tracking-wider uppercase">{label}</p>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={min}
          max={hi}
          step={step}
          value={lo}
          onChange={handleLowChange}
          className="w-full h-9 px-3 text-sm text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400 transition-colors"
          style={{ accentColor: theme.colors.primary }}
        />
        <span className="text-gray-400 text-sm shrink-0">–</span>
        <input
          type="number"
          min={lo}
          max={max}
          step={step}
          value={hi}
          onChange={handleHighChange}
          className="w-full h-9 px-3 text-sm text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-gray-400 transition-colors"
          style={{ accentColor: theme.colors.primary }}
        />
        {unit && <span className="text-sm text-gray-500 shrink-0">{unit}</span>}
      </div>
    </div>
  );
}
