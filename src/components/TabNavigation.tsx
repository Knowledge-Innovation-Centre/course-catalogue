import type { CourseTab } from '../types';
import { theme } from '../theme';

interface TabNavigationProps {
  tabs: CourseTab[];
  onTabChange?: (tabId: string) => void;
}

export function TabNavigation({ tabs, onTabChange }: TabNavigationProps) {
  return (
    <div className="bg-gray-100 flex items-start w-full overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange?.(tab.id)}
          className={`flex items-center justify-center px-4 py-4 shrink-0 transition-colors ${
            tab.active
              ? 'bg-white border-t-[3px] font-semibold text-gray-900'
              : 'font-normal text-gray-600 hover:bg-gray-50'
          }`}
          style={tab.active ? { borderTopColor: theme.colors.primary } : {}}
        >
          <span className="text-base whitespace-nowrap">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
