import type { DetailTab } from '../configTypes';
import { theme } from '../theme';

interface TabNavigationProps {
  tabs: DetailTab[];
  activeTabId: string;
  onTabClick: (tabId: string) => void;
}

export function TabNavigation({ tabs, activeTabId, onTabClick }: TabNavigationProps) {
  return (
    <div className="bg-gray-100 flex items-start w-full overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            onClick={() => onTabClick(tab.id)}
            className={`flex items-center justify-center px-3 sm:px-4 py-3 sm:py-4 shrink-0 transition-colors cursor-pointer ${
              isActive
                ? 'bg-white border-t-3  font-semibold text-gray-900'
                : 'font-normal text-gray-600 hover:bg-gray-50 border-t-3'
            }`}
            style={isActive ? { borderTopColor: theme.colors.accent } : {borderTopColor: 'transparent'}}
          >
            <span className="text-sm sm:text-base whitespace-nowrap">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
