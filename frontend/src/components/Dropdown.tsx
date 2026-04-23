import { useState, useRef, useEffect } from 'react';
import { theme } from '../theme';

interface DropdownOption {
  label: string;
  count?: number;
  disabled?: boolean;
}

interface DropdownProps {
  label: string;
  options: (string | DropdownOption)[];
  defaultValue?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function Dropdown({ label, options, defaultValue, placeholder = 'Select...', value, onChange }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState(defaultValue || placeholder);

  // Use controlled value if provided, otherwise use internal state
  const selected = value !== undefined ? value : internalSelected;
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0, maxHeight: 240, openAbove: false });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown when scrolling outside its menu (e.g. inside the filter sidebar)
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = (e: Event) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) return;
      setIsOpen(false);
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom - 20;
      const spaceAbove = rect.top - 20;
      const openAbove = spaceBelow < 150 && spaceAbove > spaceBelow;
      const maxHeight = Math.min(240, Math.max(150, openAbove ? spaceAbove : spaceBelow));

      setDropdownPosition({
        top: openAbove ? rect.top - maxHeight - 4 : rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        maxHeight,
        openAbove,
      });
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: string | DropdownOption) => {
    const optionValue = typeof option === 'string' ? option : option.label;
    if (onChange) {
      onChange(optionValue);
    } else {
      setInternalSelected(optionValue);
    }
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <p className="font-semibold text-sm text-gray-900">{label}</p>}
      <div className="relative" ref={dropdownRef}>
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggle}
          className="bg-white border border-gray-200 h-10 px-4 py-2 rounded-lg w-full text-left text-sm text-gray-600 hover:border-gray-300 focus:outline-none focus:ring-1 transition-colors flex items-center justify-between cursor-pointer"
          style={{
            '--focus-border-color': theme.colors.accent,
            '--focus-ring-color': theme.colors.accent,
          } as React.CSSProperties}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = theme.colors.accent;
            e.currentTarget.style.boxShadow = `0 0 0 1px ${theme.colors.accent}`;
          }}
          onBlur={(e) => {
            if (!isOpen) {
              e.currentTarget.style.borderColor = '';
              e.currentTarget.style.boxShadow = '';
            }
          }}
        >
          <span className={selected === placeholder ? 'text-gray-400' : 'text-gray-900'}>
            {selected}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
            className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg overflow-y-auto scrollbar-minimal"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              maxHeight: `${dropdownPosition.maxHeight}px`
            }}
          >
            {options.map((option, index) => {
              const optionLabel = typeof option === 'string' ? option : option.label;
              const optionCount = typeof option === 'string' ? undefined : option.count;
              const optionDisabled = typeof option === 'string' ? false : !!option.disabled;
              const isSelected = selected === optionLabel;

              return (
                <button
                  key={index}
                  type="button"
                  disabled={optionDisabled}
                  onClick={() => handleSelect(option)}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2 ${
                    optionDisabled ? 'opacity-40 cursor-default' : 'hover:bg-gray-50 cursor-pointer'
                  } ${
                    isSelected ? 'bg-blue-50 font-medium' : 'text-gray-700'
                  } ${index === 0 ? 'rounded-t-lg' : ''} ${index === options.length - 1 ? 'rounded-b-lg' : ''}`}
                  style={isSelected ? { color: theme.colors.accent } : {}}
                >
                  <span className="flex-1 truncate" title={optionLabel}>{optionLabel}</span>
                  {optionCount !== undefined && (
                    <span className="text-xs text-gray-500 font-normal shrink-0">
                      {optionCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
