import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import { theme } from '../theme';

interface TooltipProps {
  text: string;
  className?: string;
}

export function Tooltip({ text, className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isVisible && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;

      // Show tooltip below if not enough space above
      setPosition(spaceAbove < 100 ? 'bottom' : 'top');
    }
  }, [isVisible]);

  return (
    <span
      ref={iconRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <Info
        className="w-4.5 h-4.5 cursor-help"
        style={{ color: theme.colors.link }}
      />
      {isVisible && (
        <span
          className={`absolute z-50 px-3 py-2 text-sm font-normal normal-case text-white bg-gray-900 rounded-lg shadow-lg whitespace-normal min-w-[200px] max-w-[300px] left-1/2 transform -translate-x-1/2 pointer-events-none ${
            position === 'top'
              ? 'bottom-full mb-2'
              : 'top-full mt-2'
          }`}
          style={{
            animation: 'fadeIn 0.2s ease-in-out',
          }}
        >
          {text}
          <span
            className={`absolute left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 ${
              position === 'top'
                ? 'bottom-[-4px]'
                : 'top-[-4px]'
            }`}
          />
        </span>
      )}
    </span>
  );
}
