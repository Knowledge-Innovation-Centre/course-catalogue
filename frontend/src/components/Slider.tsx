import { useState } from 'react';
import { theme } from '../theme';

interface SliderProps {
  label: string;
  min: number;
  max: number;
  defaultValue?: number;
  step?: number;
  unit?: string;
  value?: number;
  onChange?: (value: number) => void;
}

export function Slider({ label, min, max, defaultValue = min, step = 1, unit = '', value: controlledValue, onChange }: SliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);

  // Use controlled value if provided, otherwise use internal state
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-base text-gray-500 tracking-wider uppercase">{label}</p>
        <span className="font-semibold text-sm bg-gray-100 px-2 py-1 rounded" style={{ color: theme.colors.primary }}>
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
          onChange={(e) => {
            const newValue = Number(e.target.value);
            if (onChange) {
              onChange(newValue);
            } else {
              setInternalValue(newValue);
            }
          }}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={{ accentColor: theme.colors.primary }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );
}
