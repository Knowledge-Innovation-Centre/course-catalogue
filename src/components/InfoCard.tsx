import { Monitor, MapPin, Languages, Euro, Clock, BarChart3 } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface InfoCardData {
  type: 'info-card';
  label: string;
  value: string;
  tooltip?: string;
}

interface InfoCardProps {
  card: InfoCardData;
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
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8 flex gap-3 items-center flex-[1_1_280px] min-w-[280px] lg:flex-[0_1_calc(33.333%-11px)]">
      <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-gray-900 shrink-0" strokeWidth={1.5} />
      <div className="flex flex-col gap-1">
        <p className="text-xs sm:text-sm lg:text-base font-semibold text-gray-500 tracking-wider uppercase flex items-center gap-1">
          {card.label}
          {card.tooltip && (
            <Tooltip text={card.tooltip} />
          )}
        </p>
        <p className="text-lg sm:text-xl font-semibold text-gray-900 whitespace-nowrap">
          {card.value}
        </p>
      </div>
    </div>
  );
}
