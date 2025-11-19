import type { DetailField } from '../configTypes';
import { InfoCard } from './InfoCard';
import { Tooltip } from './Tooltip';
import { theme } from '../theme';
import { ExternalLink } from 'lucide-react';

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
    if (!format) return String(val);
    return format.replace('{value}', String(val));
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
              <li key={i} className="mb-1">{item}</li>
            ))}
          </ul>
        </div>
      );

    case 'provider':
      const providerValue = typeof value === 'object' ? value : { name: value, link: '' };
      return (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start lg:items-center">
          {renderLabel(config.label, config.tooltip)}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 flex-1">
            <span className="font-medium text-sm sm:text-base text-gray-900">
              {providerValue.name}
            </span>
            {providerValue.link && (
              <a
                href={providerValue.link}
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
            const skillData = typeof skill === 'object' ? skill : { name: skill };
            return (
              <div key={idx} className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start lg:items-center">
                {renderLabel(config.label, config.tooltip)}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 flex-1">
                  <span className="font-medium text-sm sm:text-base text-gray-900 list-disc flex items-center before:content-['•'] before:mr-2">
                    {skillData.name}
                  </span>
                  {skillData.escoLink && skillsConfig.showEscoLink && (
                    <a
                      href={skillData.escoLink}
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
      const isUrl = typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'));

      return (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start">
          {renderLabel(config.label, config.tooltip, linkConfig.subtitle)}
          <div className="flex-1 flex flex-wrap items-start gap-3 sm:gap-4">
            {Array.isArray(value) ? (
              <div className="font-medium text-sm sm:text-base text-gray-900 leading-[1.5]">
                {value.map((item, itemIdx) => (
                  <p key={itemIdx} className="mb-0">{item}</p>
                ))}
              </div>
            ) : isUrl ? (
              <a
                href={value}
                className="font-medium text-sm sm:text-base underline hover:opacity-80 transition-opacity"
                style={{ color: theme.colors.link }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {value}
              </a>
            ) : (
              <span className="font-medium text-sm sm:text-base text-gray-900 leading-[1.5]">
                {value}
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
