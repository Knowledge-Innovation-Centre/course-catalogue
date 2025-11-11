import { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  label: string;
  options: string[];
  defaultValue?: string;
  placeholder?: string;
}

export function Dropdown({ label, options, defaultValue, placeholder = 'Select...' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue || placeholder);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0, maxHeight: 240 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom - 20; // 20px padding from bottom
      const maxHeight = Math.min(240, Math.max(150, spaceBelow)); // min 150px, max 240px

      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
        maxHeight
      });
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="font-semibold text-base text-gray-500 tracking-wider uppercase">{label}</p>
      <div className="relative" ref={dropdownRef}>
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggle}
          className="bg-white border border-gray-200 h-10 px-4 py-2 rounded-lg w-full text-left text-base text-gray-600 hover:border-gray-300 focus:outline-none focus:border-[#0b223b] focus:ring-1 focus:ring-[#0b223b] transition-colors flex items-center justify-between"
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
            className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg overflow-y-auto"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              maxHeight: `${dropdownPosition.maxHeight}px`
            }}
          >
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors ${
                  selected === option ? 'bg-blue-50 text-[#0b223b] font-medium' : 'text-gray-700'
                } ${index === 0 ? 'rounded-t-lg' : ''} ${index === options.length - 1 ? 'rounded-b-lg' : ''}`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
