import type { InfoCard as InfoCardType } from '../types';

interface InfoCardProps {
  card: InfoCardType;
}

// Simple icon components for common icons
const IconComponents: Record<string, React.FC<{ size?: string }>> = {
  monitor: ({ size = '32' }) => (
    <svg className={`w-${size === '32' ? '8' : '4'} h-${size === '32' ? '8' : '4'}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="14" height="10" rx="1" stroke="#9CA3AF" strokeWidth="1.5"/>
      <path d="M7 14V16H13V14" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  mapPin: ({ size = '32' }) => (
    <svg className={`w-${size === '32' ? '8' : '4'} h-${size === '32' ? '8' : '4'}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 17C10 17 16 13 16 8.5C16 5.5 13.5 4 10 4C6.5 4 4 5.5 4 8.5C4 13 10 17 10 17Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="10" cy="8.5" r="1.5" fill="#9CA3AF"/>
    </svg>
  ),
  language: ({ size = '32' }) => (
    <svg className={`w-${size === '32' ? '8' : '4'} h-${size === '32' ? '8' : '4'}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2Z" fill="#9CA3AF"/>
      <path d="M10 5V10L13 11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  euro: ({ size = '32' }) => (
    <svg className={`w-${size === '32' ? '8' : '4'} h-${size === '32' ? '8' : '4'}`} viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6C16.5 5 14.5 4.5 12.5 5C9 6 7 9 7 12.5C7 16 9 19 12.5 20C14.5 20.5 16.5 20 18 19M5 10H12M5 14H12" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  clock: ({ size = '32' }) => (
    <svg className={`w-${size === '32' ? '8' : '4'} h-${size === '32' ? '8' : '4'}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 5V10L13 13" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="10" cy="10" r="7.5" stroke="#9CA3AF" strokeWidth="1.5"/>
    </svg>
  ),
  barChart: ({ size = '32' }) => (
    <svg className={`w-${size === '32' ? '8' : '4'} h-${size === '32' ? '8' : '4'}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="7" width="2" height="6" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="11" y="5" width="2" height="8" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

export function InfoCard({ card }: InfoCardProps) {
  const IconComponent = IconComponents[card.icon];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 flex gap-3 items-center">
      {IconComponent && <IconComponent size="32" />}
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold text-gray-500 tracking-wider uppercase flex items-center gap-1">
          {card.label}
          {card.hasTooltip && (
            <span className="text-blue-600 font-bold">ⓘ</span>
          )}
        </p>
        <p className="text-xl font-semibold text-gray-900 whitespace-nowrap">
          {card.value}
        </p>
      </div>
    </div>
  );
}
