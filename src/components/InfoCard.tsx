import type { InfoCard as InfoCardType } from '../types';
import { Monitor, MapPin, Languages, Euro, Clock, BarChart3, Info } from 'lucide-react';

interface InfoCardProps {
  card: InfoCardType;
}

// Map labels to appropriate lucide-react icons
function getIconForLabel(label: string) {
  const labelLower = label.toLowerCase();

  if (labelLower.includes('delivery') || labelLower.includes('mode')) {
    return Monitor;
  }
  if (labelLower.includes('country') || labelLower.includes('location')) {
    return MapPin;
  }
  if (labelLower.includes('language')) {
    return Languages;
  }
  if (labelLower.includes('price') || labelLower.includes('cost') || labelLower.includes('fee')) {
    return Euro;
  }
  if (labelLower.includes('workload') || labelLower.includes('duration') || labelLower.includes('time') || labelLower.includes('ects')) {
    return Clock;
  }
  if (labelLower.includes('level') || labelLower.includes('eqf')) {
    return BarChart3;
  }

  // Default to BarChart3 if no match found
  return BarChart3;
}

export function InfoCard({ card }: InfoCardProps) {
  const IconComponent = getIconForLabel(card.label);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 flex gap-3 items-center flex-[1_1_300px]">
      <IconComponent className="w-8 h-8 text-gray-900" strokeWidth={1.5} />
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold text-gray-500 tracking-wider uppercase flex items-center gap-1">
          {card.label}
          {card.hasTooltip && (
            <Info className="w-4 h-4 text-blue-600" />
          )}
        </p>
        <p className="text-xl font-semibold text-gray-900 whitespace-nowrap">
          {card.value}
        </p>
      </div>
    </div>
  );
}
