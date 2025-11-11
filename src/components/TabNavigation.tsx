import type { CourseTab } from '../types';
import { theme } from '../theme';

interface TabNavigationProps {
  tabs: CourseTab[];
  activeTabId: string;
  onTabClick: (tabId: string) => void;
}

export function TabNavigation({ tabs, activeTabId, onTabClick }: TabNavigationProps) {
  return (
    <div className="bg-gray-100 flex items-start w-full overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            onClick={() => onTabClick(tab.id)}
            className={`flex items-center justify-center px-4 py-4 shrink-0 transition-colors cursor-pointer ${
              isActive
                ? 'bg-white border-t-3  font-semibold text-gray-900'
                : 'font-normal text-gray-600 hover:bg-gray-50 border-t-3'
            }`}
            style={isActive ? { borderTopColor: theme.colors.primary } : {borderTopColor: 'transparent'}}
          >
            <span className="text-base whitespace-nowrap">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
