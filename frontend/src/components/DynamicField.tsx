import type { DetailField, OfferingDetailConfig, OfferingsDetailField } from '../configTypes';
import { InfoCard } from './InfoCard';
import { Tooltip } from './Tooltip';
import { theme } from '../theme';
import { ExternalLink } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

function getNestedValue(data: any, key: string | undefined): any {
  if (!key || data === undefined || data === null) return undefined;
  const parts = key.split('.');
  let current = data;
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    current = current[part];
  }
  return current;
}

function getLucideIcon(iconName?: string) {
  if (!iconName) return null;
  const icons = LucideIcons as any;
  const pascal = iconName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  return icons[pascal] || null;
}

function formatDate(str: string): string {
  if (!str) return '';
  // ISO 8601 datetime → YYYY-MM-DD
  const iso = str.match(/^(\d{4}-\d{2}-\d{2})T/);
  if (iso) return iso[1];
  return str;
}

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
    // If identifier, render accordingly
    if (value['type'] == 'elm:Identifier' || value['type'] == 'OrgRegIdentifier' || value['type'] == 'SchacIdentifier') {
      return value['skos:notation'] + ' (' + value['elm:schemeName'] + ')';
    }
    // If location/address, render accordingly
    if (value['type'] == 'dcterms:Location') {
      console.log(value);
      const country = value['elm:address']['elm:countryCode']['skos:prefLabel'] || value['elm:address']['elm:countryCode']['id'].split('/').pop();
      if (value['elm:geographicName'] !== undefined) {
        return value['elm:geographicName'] + ' (' + country + ')';
      } else {
        return country;
      }
    }
    // Try common display property names in order of preference (including prefixed versions)
    const displayKeys = ['title', 'name', 'label', 'value', 'text', 'description', 'dcterms:title', 'dcterms:name', 'skos:prefLabel', 'skos:notation'];
    for (const key of displayKeys) {
      if (value[key] !== undefined) return toDisplayString(value[key], allowUrls);
    }
    // Try any key that contains common display terms
    const keys = Object.keys(value);
    for (const key of keys) {
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('title') || lowerKey.includes('name') || lowerKey.includes('label') || lowerKey.includes('preflabel')) {
        return toDisplayString(value[key], allowUrls);
      }
    }
    // Last resort: use id if it's a string (but not a URL unless allowed)
    if (typeof value.id === 'string') {
      if (allowUrls || (!value.id.startsWith('http://') && !value.id.startsWith('https://'))) {
        return value.id;
      }
    }
    // Fallback: return first non-URL string property
    for (const key of keys) {
      if (typeof value[key] === 'string') {
        if (allowUrls || (!value[key].startsWith('http://') && !value[key].startsWith('https://'))) {
          return value[key];
        }
      }
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
      const listItems = Array.isArray(value) ? value : [];
      return (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {renderLabel(config.label, config.tooltip)}
          <div className="flex-1">
            <ul className="font-medium text-sm sm:text-base text-gray-900 leading-[1.5] list-disc ml-5">
              {listItems.map((item, i) => {
                const display = toDisplayString(item);
                if (!display) return null;

                // Check for nested ESCO skills (can be object or array)
                const escoRaw = typeof item === 'object' && item?.['elm:relatedESCOSkill'];
                const escoSkills = escoRaw
                  ? (Array.isArray(escoRaw) ? escoRaw : [escoRaw])
                  : [];

                return (
                  <li key={i} className="mb-1">
                    {display}
                    {escoSkills.map((skill: any, j: number) => {
                      const url = skill?.id;
                      if (!url || typeof url !== 'string') return null;
                      return (
                        <a
                          key={j}
                          href={url}
                          className="inline-flex items-center gap-1 ml-2 text-xs underline hover:opacity-80 transition-opacity"
                          style={{ color: theme.colors.link }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          related ESCO
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      );
                    })}
                  </li>
                );
              })}
            </ul>
          </div>
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

    case 'offerings': {
      const offeringsConfig = config as OfferingsDetailField;
      const offerings = Array.isArray(value) ? value : [value];
      const visible = offerings.filter(o => o !== undefined && o !== null);
      if (visible.length === 0) return null;
      return (
        <div className="flex flex-col gap-4">
          {visible.map((offering, idx) => (
            <Offering key={idx} offering={offering} config={offeringsConfig} />
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}

function OfferingDetailRow({ detail, offering }: { detail: OfferingDetailConfig; offering: any }) {
  const Icon = getLucideIcon(detail.icon);

  const renderValue = () => {
    if (detail.type === 'date-range') {
      const label = toDisplayString(getNestedValue(offering, detail.keys?.label));
      const from = formatDate(toDisplayString(getNestedValue(offering, detail.keys?.from), true));
      const to = formatDate(toDisplayString(getNestedValue(offering, detail.keys?.to), true));
      if (!label && !from && !to) return null;
      const parts: string[] = [];
      if (label) parts.push(label);
      if (from && to) parts.push(`${from} → ${to}`);
      else if (from) parts.push(`from ${from}`);
      else if (to) parts.push(`until ${to}`);
      return <span>{parts.join(' · ')}</span>;
    }

    if (detail.type === 'link') {
      const raw = getNestedValue(offering, detail.key);
      const href = toDisplayString(raw, true);
      if (!href) return null;
      const isUrl = href.startsWith('http://') || href.startsWith('https://');
      if (!isUrl) return <span>{href}</span>;
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline hover:opacity-80 transition-opacity break-all"
          style={{ color: theme.colors.link }}
        >
          {href}
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
        </a>
      );
    }

    // default: text
    const raw = getNestedValue(offering, detail.key);
    const str = toDisplayString(raw);
    if (!str) return null;
    const formatted = detail.format ? detail.format.replace('{value}', str) : str;
    return <span>{formatted}</span>;
  };

  const content = renderValue();
  if (!content) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 text-sm">
      <div className="flex items-center gap-2 sm:w-48 shrink-0 text-gray-500 font-semibold uppercase tracking-wider text-xs">
        {Icon && <Icon className="w-4 h-4 shrink-0" style={{ color: theme.colors.accent }} />}
        <span>{detail.label}</span>
      </div>
      <div className="flex-1 text-gray-900 font-medium leading-[1.5] min-w-0">
        {content}
      </div>
    </div>
  );
}

function Offering({ offering, config }: { offering: any; config: OfferingsDetailField }) {
  const title = toDisplayString(getNestedValue(offering, config.titleKey));
  const note = config.noteKey ? toDisplayString(getNestedValue(offering, config.noteKey)) : '';

  return (
    <div className="border border-gray-200 rounded-lg p-5 sm:p-6 flex flex-col gap-4">
      {title && (
        <h3 className="font-semibold text-lg sm:text-xl text-gray-900 leading-[1.3]">
          {title}
        </h3>
      )}
      <div className="flex flex-col gap-3">
        {config.details.map((detail, i) => (
          <OfferingDetailRow key={i} detail={detail} offering={offering} />
        ))}
      </div>
      {note && (
        <div className="pt-4 mt-1 border-t border-gray-100 flex flex-col gap-1">
          <span className="font-semibold text-xs text-gray-500 tracking-wider uppercase">
            {config.noteLabel || 'Description'}
          </span>
          <p className="text-sm text-gray-700 leading-[1.5] whitespace-pre-line">
            {note}
          </p>
        </div>
      )}
    </div>
  );
}
