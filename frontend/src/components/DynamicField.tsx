import type { DetailField } from '../configTypes';
import { InfoCard } from './InfoCard';
import { Tooltip } from './Tooltip';
import { theme } from '../theme';
import { ExternalLink } from 'lucide-react';

/**
 * Convert any value to a displayable string
 * Handles primitives, arrays, and objects generically
 * @param value - The value to convert
 * @param allowUrls - Whether to allow URL strings (default: false)
 */
function toDisplayString(value: any, allowUrls: boolean = false): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') {
    // Don't display URLs/links as values unless explicitly allowed
    if (!allowUrls && (value.startsWith('http://') || value.startsWith('https://'))) return '';
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return '';
    // If array of primitives, join them
    if (typeof value[0] === 'string' || typeof value[0] === 'number') {
      return value.join(', ');
    }
    // If array of objects, get display string of first item
    return toDisplayString(value[0]);
  }
  if (typeof value === 'object') {
    // Try common display property names in order of preference
    const displayKeys = ['title', 'name', 'label', 'value', 'text', 'description'];
    for (const key of displayKeys) {
      if (value[key] !== undefined) return toDisplayString(value[key]);
    }
    // Try any key that contains common display terms
    const keys = Object.keys(value);
    for (const key of keys) {
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('title') || lowerKey.includes('name') || lowerKey.includes('label')) {
        return toDisplayString(value[key]);
      }
    }
    // Last resort: use id if it's a string
    if (typeof value.id === 'string') return value.id;
    // Fallback: return first string property
    for (const key of keys) {
      if (typeof value[key] === 'string') return value[key];
    }
  }
  return '';
}

interface DynamicFieldProps {
  config: DetailField;
  value: any;
}

export function DynamicField({ config, value }: DynamicFieldProps) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const renderLabel = (label: string, tooltip?: string, subtitle?: string) => (
    <div className="flex flex-col gap-1 w-full lg:w-[310px] shrink-0 self-start mb-2 lg:mb-0">
      <span className="font-semibold text-sm sm:text-base text-gray-500 tracking-wider uppercase">
        {label}
        {tooltip && <Tooltip text={tooltip} className="inline-block ml-2 align-middle mb-1" />}
      </span>
      {subtitle && (
        <p className="font-medium text-xs sm:text-sm text-gray-500 tracking-[0.56px]">
          {subtitle}
        </p>
      )}
    </div>
  );

  const formatValue = (format: string | undefined, val: any): string => {
    let displayStr = toDisplayString(val);
    // Apply valueMap if available (e.g., "true" -> "Active")
    if (config.valueMap && config.valueMap[displayStr]) {
      displayStr = config.valueMap[displayStr];
    }
    if (!format) return displayStr;
    return format.replace('{value}', displayStr);
  };

  switch (config.type) {
    case 'info-card':
      return (
        <InfoCard
          card={{
            type: 'info-card',
            label: config.label,
            value: formatValue(config.format, value),
            tooltip: config.tooltip
          }}
        />
      );

    case 'text':
      return (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start lg:items-center">
          {renderLabel(config.label, config.tooltip)}
          <p className="font-medium text-sm sm:text-base text-gray-900 leading-[1.5] flex-1">
            {formatValue(config.format, value)}
          </p>
        </div>
      );

    case 'list':
      return (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {renderLabel(config.label, config.tooltip)}
          <ul className="flex-1 font-medium text-sm sm:text-base text-gray-900 leading-[1.5] list-disc ml-5">
            {Array.isArray(value) && value.map((item, i) => (
              <li key={i} className="mb-1">{toDisplayString(item)}</li>
            ))}
          </ul>
        </div>
      );

    case 'provider':
      const providerName = toDisplayString(value);
      const providerLink = typeof value === 'object' && value.link ? value.link : '';
      return (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start lg:items-center">
          {renderLabel(config.label, config.tooltip)}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 flex-1">
            <span className="font-medium text-sm sm:text-base text-gray-900">
              {providerName}
            </span>
            {providerLink && (
              <a
                href={providerLink}
                className="flex items-center gap-1 font-medium text-sm sm:text-base underline hover:opacity-80 transition-opacity"
                style={{ color: theme.colors.link }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 15L15 5M15 5H9M15 5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
          </div>
        </div>
      );

    case 'skills':
      const skillsConfig = config as any;
      const skills = Array.isArray(value) ? value : [value];

      return (
        <>
          {skills.map((skill: any, idx: number) => {
            const skillName = toDisplayString(skill);
            const skillLink = typeof skill === 'object' && skill.escoLink ? skill.escoLink : '';
            return (
              <div key={idx} className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start lg:items-center">
                {renderLabel(config.label, config.tooltip)}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 flex-1">
                  <span className="font-medium text-sm sm:text-base text-gray-900 list-disc flex items-center before:content-['•'] before:mr-2">
                    {skillName}
                  </span>
                  {skillLink && skillsConfig.showEscoLink && (
                    <a
                      href={skillLink}
                      className="flex items-center gap-1 font-medium text-sm sm:text-base underline hover:opacity-80 transition-opacity"
                      style={{ color: theme.colors.link }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ESCO
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 15L15 5M15 5H9M15 5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </>
      );

    case 'link':
      const linkConfig = config as any;
      const displayValue = toDisplayString(value, true); // Allow URLs for link type
      const isUrl = displayValue.startsWith('http://') || displayValue.startsWith('https://');

      return (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start">
          {renderLabel(config.label, config.tooltip, linkConfig.subtitle)}
          <div className="flex-1 flex flex-wrap items-start gap-3 sm:gap-4">
            {Array.isArray(value) ? (
              <div className="font-medium text-sm sm:text-base text-gray-900 leading-[1.5]">
                {value.map((item, itemIdx) => (
                  <p key={itemIdx} className="mb-0">{toDisplayString(item)}</p>
                ))}
              </div>
            ) : isUrl ? (
              <a
                href={displayValue}
                className="font-medium text-sm sm:text-base underline hover:opacity-80 transition-opacity"
                style={{ color: theme.colors.link }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {displayValue}
              </a>
            ) : (
              <span className="font-medium text-sm sm:text-base text-gray-900 leading-[1.5]">
                {displayValue}
              </span>
            )}
            {linkConfig.linkConfig?.url && (
              <a
                href={linkConfig.linkConfig.url}
                className="flex items-center gap-1 font-medium text-sm sm:text-base underline hover:opacity-80 transition-opacity whitespace-nowrap"
                style={{ color: theme.colors.link }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {linkConfig.linkConfig.text}
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      );

    default:
      return null;
  }
}
