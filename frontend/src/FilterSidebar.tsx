import { RangeSlider } from './components/RangeSlider';
import { Dropdown } from './components/Dropdown';
import { theme } from './theme';
import { useConfig } from './ConfigContext';
import type { Filter, MultiselectFilter, SelectFilter, RangeFilter, ToggleFilter } from './configTypes';

interface FilterSidebarProps {
  isMobile?: boolean;
  filterValues?: Record<string, any>;
  onFilterChange?: (filterKey: string, value: any) => void;
  onResetFilters?: () => void;
  onSearchChange?: (query: string) => void;
  activeFiltersCount?: number;
  facetCounts?: Record<string, Record<string, number>>;
}

export function FilterSidebar({
  isMobile = false,
  filterValues = {},
  onFilterChange,
  onResetFilters,
  onSearchChange,
  activeFiltersCount = 0,
  facetCounts = {},
}: FilterSidebarProps) {
  const { config, loading } = useConfig();

  if (loading || !config) {
    return (
      <div className={`bg-white ${!isMobile ? 'border border-gray-200 rounded-lg' : ''} w-full lg:w-[328px] flex items-center justify-center p-8`}>
        <p className="text-gray-500 text-sm">Loading filters...</p>
      </div>
    );
  }

  const enabledFilters = Object.entries(config.filters).filter(([_, filter]) => filter.enabled);

  const renderFilter = (key: string, filter: Filter) => {
    switch (filter.type) {
      case 'multiselect':
        return renderMultiselectFilter(key, filter as MultiselectFilter);
      case 'select':
        return renderSelectFilter(key, filter as SelectFilter);
      case 'range':
        return renderRangeFilter(key, filter as RangeFilter);
      case 'toggle':
        return renderToggleFilter(key, filter as ToggleFilter);
      default:
        return null;
    }
  };

  const handleMultiselectChange = (key: string, optionValue: string, checked: boolean) => {
    if (!onFilterChange) return;

    const currentValues = (filterValues[key] as string[]) || [];
    const newValues = checked
      ? [...currentValues, optionValue]
      : currentValues.filter(v => v !== optionValue);

    onFilterChange(key, newValues.length > 0 ? newValues : undefined);
  };

  const renderMultiselectFilter = (key: string, filter: MultiselectFilter) => {
    if (!filter.options || filter.options.length === 0) return null;

    const selectedValues = (filterValues[key] as string[]) || [];
    const meilisearchField = filter.meilisearchField;
    const drillDownCounts = facetCounts[meilisearchField];

    return (
      <div key={key} className="flex flex-col gap-3 w-full">
        <p className="font-semibold text-sm text-gray-500 tracking-wider uppercase">{filter.label}</p>
        <div className="flex flex-col gap-1 w-full">
          {filter.options.map(option => {
            const isChecked = selectedValues.includes(option.value);
            const count = drillDownCounts ? (drillDownCounts[option.value] ?? 0) : option.count;
            const disabled = !isChecked && drillDownCounts !== undefined && count === 0;
            return (
              <label key={option.value} className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors group ${disabled ? 'opacity-40 cursor-default' : 'cursor-pointer hover:bg-gray-50'}`}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={disabled}
                  onChange={(e) => handleMultiselectChange(key, option.value, e.target.checked)}
                  className={`w-4 h-4 rounded border-gray-300 shrink-0 ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
                  style={{ accentColor: theme.colors.primary }}
                />
                <span className={`flex-1 text-sm wrap-break-words ${isChecked ? 'font-normal text-gray-900' : 'font-normal text-gray-700'} ${!disabled ? 'group-hover:text-gray-900' : ''}`}>
                  {option.label}
                </span>
                <span className="text-xs text-gray-500 font-normal shrink-0">
                  {count ?? 0}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSelectFilter = (key: string, filter: SelectFilter) => {
    if (!filter.options || filter.options.length === 0) return null;

    const meilisearchField = filter.meilisearchField;
    const drillDownCounts = facetCounts[meilisearchField];

    const options = [
      'All',
      ...filter.options
        .map(opt => ({
          label: opt.label,
          count: drillDownCounts ? (drillDownCounts[opt.value] ?? 0) : opt.count,
          disabled: drillDownCounts !== undefined && (drillDownCounts[opt.value] ?? 0) === 0
        }))
    ];
    const currentValue = filterValues[key] as string;
    // Capitalize first letter for display
    const displayValue = currentValue
      ? currentValue.charAt(0).toUpperCase() + currentValue.slice(1)
      : 'All';

    return (
      <Dropdown
        key={key}
        label={filter.label.toUpperCase()}
        options={options}
        value={displayValue}
        onChange={(value: string) => {
          if (onFilterChange) {
            onFilterChange(key, value === 'All' ? undefined : value.toLowerCase());
          }
        }}
      />
    );
  };

  const renderRangeFilter = (key: string, filter: RangeFilter) => {
    const currentValue = filterValues[key] as [number, number] | undefined;

    return (
      <RangeSlider
        key={key}
        label={filter.label.toUpperCase()}
        min={filter.min}
        max={filter.max}
        value={currentValue}
        step={filter.step}
        unit={filter.unit}
        onChange={(value: [number, number]) => {
          if (onFilterChange) {
            // Clear filter if full range is selected
            const isFullRange = value[0] === filter.min && value[1] === filter.max;
            onFilterChange(key, isFullRange ? undefined : value);
          }
        }}
      />
    );
  };

  const renderToggleFilter = (key: string, filter: ToggleFilter) => {
    const currentValue = filterValues[key] as string;

    return (
      <div key={key} className="flex flex-col gap-3 w-full">
        <p className="font-semibold text-sm text-gray-500 tracking-wider uppercase">{filter.label}</p>
        <div className="flex flex-col gap-1 w-full">
          <label className="flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-50 transition-colors group">
            <input
              type="checkbox"
              checked={currentValue === 'true'}
              onChange={(e) => {
                if (onFilterChange) {
                  onFilterChange(key, e.target.checked ? 'true' : undefined);
                }
              }}
              className="w-4 h-4 rounded border-gray-300 cursor-pointer shrink-0"
              style={{ accentColor: theme.colors.primary }}
            />
            <span className={`flex-1 text-sm break-words ${currentValue === 'true' ? 'font-semibold text-gray-900' : 'font-normal text-gray-700'} group-hover:text-gray-900`}>
              Active only
            </span>
          </label>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white ${!isMobile ? 'border border-gray-200 rounded-lg' : ''} w-full lg:w-[328px] flex flex-col ${!isMobile ? 'max-h-[calc(100vh-280px)]' : ''}`}>
      <div className={`flex flex-col ${!isMobile ? 'rounded-[inherit]' : ''} w-full h-full ${!isMobile ? 'overflow-hidden' : ''}`}>
        {/* Search */}
        <div className="bg-white border-b border-gray-200 w-full shrink-0">
          <div className="flex gap-4 items-center px-4 sm:px-6 py-4 sm:py-5 w-full">
            <svg className="w-4 h-4 shrink-0 text-gray-400" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search courses..."
              className="flex-1 font-normal text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
              onChange={(e) => {
                if (onSearchChange) {
                  onSearchChange(e.target.value);
                }
              }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className={`flex-1 bg-white flex flex-col gap-4 sm:gap-6 ${!isMobile ? 'overflow-y-auto' : ''} p-4 sm:p-6 w-full`}>
          {enabledFilters.map(([key, filter]) => renderFilter(key, filter))}
        </div>

        {/* Footer - Reset button */}
        {activeFiltersCount > 0 && (
          <div className="bg-white border-t border-gray-200 flex flex-col p-4 sm:p-6 w-full shrink-0">
            <button
              onClick={onResetFilters}
              className="w-full h-10 px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
