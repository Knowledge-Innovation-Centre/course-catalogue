import { useState, useRef, useEffect, useMemo } from 'react';
import { Check, Search } from 'lucide-react';
import { theme } from '../theme';

export interface MultiselectOption {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

interface MultiselectDropdownProps {
  label: string;
  options: MultiselectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  searchPlaceholder?: string;
}

export function MultiselectDropdown({
  label,
  options,
  selectedValues,
  onChange,
  searchPlaceholder = 'Search...',
}: MultiselectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
    maxHeight: number;
    openAbove: boolean;
  }>({ left: 0, width: 0, maxHeight: 320, openAbove: false });

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Filter options by search
  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter(o => o.label.toLowerCase().includes(q));
  }, [options, search]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current && !containerRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close dropdown when scrolling outside its menu
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = (e: Event) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) return;
      setIsOpen(false);
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [isOpen]);

  const toggleOpen = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom - 20;
      const spaceAbove = rect.top - 20;
      const openAbove = spaceBelow < 200 && spaceAbove > spaceBelow;
      const maxHeight = Math.min(360, Math.max(200, openAbove ? spaceAbove : spaceBelow));
      setPosition({
        top: openAbove ? undefined : rect.bottom + 4,
        bottom: openAbove ? window.innerHeight - rect.top + 4 : undefined,
        left: rect.left,
        width: Math.max(rect.width, 260),
        maxHeight,
        openAbove,
      });
      setSearch('');
    }
    setIsOpen(!isOpen);
  };

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  const selectedCount = selectedValues.length;
  const buttonLabel = selectedCount === 0
    ? 'All'
    : selectedCount === 1
      ? (options.find(o => o.value === selectedValues[0])?.label ?? `${selectedCount} selected`)
      : `${selectedCount} selected`;

  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="font-semibold text-sm text-gray-900">{label}</p>
      <div className="relative" ref={containerRef}>
        <button
          ref={buttonRef}
          type="button"
          onClick={toggleOpen}
          className="bg-white border border-gray-200 h-10 px-4 py-2 rounded-lg w-full text-left text-sm text-gray-900 hover:border-gray-300 transition-colors flex items-center justify-between cursor-pointer"
        >
          <span className={selectedCount === 0 ? 'text-gray-500' : 'text-gray-900'}>
            {buttonLabel}
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div
            ref={menuRef}
            className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col overflow-hidden"
            style={{
              top: position.top !== undefined ? `${position.top}px` : undefined,
              bottom: position.bottom !== undefined ? `${position.bottom}px` : undefined,
              left: `${position.left}px`,
              width: `${position.width}px`,
              maxHeight: `${position.maxHeight}px`,
            }}
          >
            {/* Search */}
            <div className="p-2">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 h-[37px]">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none text-gray-900 placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex-1 overflow-y-auto scrollbar-minimal">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">No results</div>
              ) : (
                filteredOptions.map((option) => {
                  const isChecked = selectedValues.includes(option.value);
                  const disabled = !isChecked && !!option.disabled;
                  return (
                    <label
                      key={option.value}
                      className={`flex items-center justify-between gap-2 px-4 py-2 transition-colors ${
                        disabled ? 'opacity-40 cursor-default' : 'cursor-pointer hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={disabled}
                          onChange={() => toggleValue(option.value)}
                          className="sr-only peer"
                        />
                        <span
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            isChecked ? 'border-transparent' : 'border-gray-300 bg-gray-50'
                          }`}
                          style={isChecked ? { backgroundColor: theme.colors.accent } : {}}
                        >
                          {isChecked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </span>
                        <span className={`truncate text-sm ${isChecked ? 'font-semibold text-gray-900' : 'font-normal text-gray-700'}`}>
                          {option.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 font-normal shrink-0">
                        {option.count ?? 0}
                      </span>
                    </label>
                  );
                })
              )}
            </div>

            {/* Clear button */}
            {selectedCount > 0 && (
              <>
                <div className="border-t border-gray-200" />
                <div className="px-4 py-2">
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ color: theme.colors.accent }}
                  >
                    Clear
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
