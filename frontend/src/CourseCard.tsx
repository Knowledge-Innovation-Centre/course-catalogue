import { Link } from 'react-router-dom';
import type { CourseListItem } from './courseDataTypes';
import type { CourseCardField } from './configTypes';
import { useConfig } from './ConfigContext';
import { useFavorites } from './FavoritesContext';
import { theme } from './theme';
import * as LucideIcons from 'lucide-react';
import { Star } from 'lucide-react';

interface CourseCardProps {
  course: CourseListItem;
}

/**
 * Get Lucide icon component by name
 */
function getIcon(iconName: string) {
  const icons = LucideIcons as any;
  // Convert kebab-case to PascalCase
  const pascalCase = iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  return icons[pascalCase] || icons.Circle;
}

/**
 * Convert any value to a displayable string
 * Handles primitives, arrays, and objects generically
 */
function toDisplayString(value: any): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') {
    // Don't display URLs/links as values
    if (value.startsWith('http://') || value.startsWith('https://')) return '';
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
    // Try common display property names in order of preference (including prefixed versions)
    const displayKeys = ['title', 'name', 'label', 'value', 'text', 'description', 'dcterms:title', 'dcterms:name', 'skos:prefLabel'];
    for (const key of displayKeys) {
      if (value[key] !== undefined) return toDisplayString(value[key]);
    }
    // Try any key that contains common display terms
    const keys = Object.keys(value);
    for (const key of keys) {
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('title') || lowerKey.includes('name') || lowerKey.includes('label') || lowerKey.includes('preflabel')) {
        return toDisplayString(value[key]);
      }
    }
    // Last resort: use id if it's a non-URL string
    if (typeof value.id === 'string' && !value.id.startsWith('http://') && !value.id.startsWith('https://')) {
      return value.id;
    }
    // Fallback: return first non-URL string property
    for (const key of keys) {
      if (typeof value[key] === 'string' && !value[key].startsWith('http://') && !value[key].startsWith('https://')) {
        return value[key];
      }
    }
  }
  return '';
}

/**
 * Format field value using format template
 */
function formatValue(format: string, value: any): string {
  const displayStr = toDisplayString(value);
  if (!format) return displayStr;
  return format.replace('{value}', displayStr);
}

/**
 * Get value from course data using key
 */
function getValue(course: CourseListItem, key: string): any {
  if (!key) return undefined;
  const keys = key.split('.');
  let value: any = course;
  for (const k of keys) {
    if (value === undefined || value === null) return undefined;
    value = value[k];
  }
  return value;
}

/**
 * CourseCard Component
 *
 * Dynamically renders course card fields based on config.courseCard configuration.
 * Fields are organized by position: header, subheader, badges, footer
 */
export function CourseCard({ course }: CourseCardProps) {
  const { config } = useConfig();
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!config) return null;

  const courseIsFavorite = isFavorite(course.id);

  // Group fields by position
  const headerFields = config.courseCard.fields.filter(f => f.position === 'header');
  const subheaderFields = config.courseCard.fields.filter(f => f.position === 'subheader');
  const badgeFields = config.courseCard.fields.filter(f => f.position === 'badges');
  const footerFields = config.courseCard.fields.filter(f => f.position === 'footer');

  const renderField = (field: CourseCardField) => {
    const rawValue = getValue(course, field.key);

    // Don't render if no value
    if (rawValue === undefined || rawValue === null || rawValue === '') {
      return null;
    }

    let displayValue = toDisplayString(rawValue);

    // Don't render if we couldn't extract a displayable value
    if (!displayValue) {
      return null;
    }

    // Apply valueMap if available (e.g., "true" -> "Active")
    if (field.valueMap && field.valueMap[displayValue]) {
      displayValue = field.valueMap[displayValue];
    }

    const formattedValue = formatValue(field.format, displayValue);

    // Get icon - use iconMap if available, otherwise use field icon
    let iconName = field.icon;
    if (field.iconMap && field.iconMap[displayValue]) {
      iconName = field.iconMap[displayValue];
    }
    const IconComponent = iconName ? getIcon(iconName) : null;

    switch (field.type) {
      case 'text':
        return (
          <span key={field.key} className={field.className || 'font-normal text-xs sm:text-sm'}>
            {formattedValue}
          </span>
        );

      case 'badge': {
        // Footer badges are rendered as status pills with a glowing dot
        if (field.position === 'footer') {
          const rawStr = toDisplayString(rawValue);
          const isActive = rawStr === 'true' || rawStr.toLowerCase() === 'active' || rawStr.toLowerCase() === 'open';
          return (
            <div
              key={field.key}
              className={`flex items-center gap-2 px-2.5 py-0.5 rounded ${isActive ? 'bg-green-700' : 'bg-gray-600'}`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full outline outline-2 outline-offset-[-1px] ${
                  isActive ? 'bg-green-300 outline-green-400' : 'bg-gray-300 outline-gray-400'
                }`}
                style={isActive ? { boxShadow: '0px 0px 12px 0px rgba(168, 255, 226, 0.80)' } : undefined}
              />
              <span className="text-white text-sm font-medium leading-[21px]">{formattedValue}</span>
            </div>
          );
        }
        return (
          <div key={field.key} className="flex gap-1.5 items-center border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white">
            {IconComponent && <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" style={{ color: theme.colors.accent }} />}
            <span className="text-xs sm:text-sm font-normal text-gray-900">{formattedValue}</span>
          </div>
        );
      }

      case 'icon-text':
        return (
          <div key={field.key} className="flex gap-1.5 items-center">
            {IconComponent && <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />}
            <span className={field.className || 'font-normal text-xs sm:text-sm'}>
              {formattedValue}
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(course.id);
  };

  return (
    <Link
      to={`/course/${course.id}`}
      className="flex flex-col rounded-lg border border-gray-200 bg-white w-full hover:shadow-[0_8px_8px_-8px_rgba(0,0,0,0.3)] transition-shadow duration-200 cursor-pointer relative group"
    >
      {/* Favorite Button + Tooltip */}
      <div className="absolute top-3 right-3 z-10 hover:z-50 group/fav">
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 pointer-events-none opacity-0 translate-y-1 transition-all duration-150 group-hover/fav:opacity-100 group-hover/fav:translate-y-0">
          <div className="relative bg-white rounded shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.10),0px_1px_3px_0px_rgba(0,0,0,0.10)] px-3 py-2 whitespace-nowrap">
            <span className="text-gray-900 text-sm font-medium leading-[21px]">
              {courseIsFavorite ? 'Remove from favourites' : 'Add to favourites'}
            </span>
            {/* Arrow */}
            <div
              className="absolute top-full right-4 w-2 h-2 bg-white"
              style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
            />
          </div>
        </div>
        <button
          onClick={handleFavoriteClick}
          className="bg-white hover:bg-gray-50 p-2 rounded-lg border border-gray-200 transition-all duration-200 active:scale-95"
          aria-label={courseIsFavorite ? 'Remove from favourites' : 'Add to favourites'}
        >
          <Star
            className="w-4 h-4 transition-all duration-200"
            style={{
              color: theme.colors.accent,
              fill: courseIsFavorite ? theme.colors.accent : 'none',
            }}
          />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-3 p-4 sm:p-5 pr-14">
        <div className="flex flex-col gap-1">
          {/* Header fields (title) */}
          {headerFields.map(field => {
            const displayValue = toDisplayString(getValue(course, field.key));
            if (!displayValue) return null;
            return (
              <p
                key={field.key}
                className={field.className || 'font-semibold text-base sm:text-lg text-gray-900 tracking-tight'}
              >
                {displayValue}
              </p>
            );
          })}

          {/* Subheader fields (university, etc.) */}
          {subheaderFields.some(f => toDisplayString(getValue(course, f.key))) && (
            <div className="flex flex-wrap gap-1 items-center text-gray-500 text-xs sm:text-sm">
              <span>By</span>
              {subheaderFields.map(field => {
                const displayValue = toDisplayString(getValue(course, field.key));
                if (!displayValue) return null;
                return (
                  <span key={field.key} className="font-normal text-gray-900">
                    {displayValue}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Badge fields (ects, level, delivery mode, etc.) */}
        {badgeFields.length > 0 && (
          <div className="flex flex-wrap gap-2 items-start">
            {badgeFields.map(renderField)}
          </div>
        )}
      </div>

      {/* Footer */}
      {(() => {
        const textFields = footerFields.filter(f => f.type === 'text' || f.type === 'icon-text');
        const badgeFieldsInFooter = footerFields.filter(f => f.type === 'badge');
        const renderedText = textFields.map(renderField).filter(Boolean);
        const renderedBadges = badgeFieldsInFooter.map(renderField).filter(Boolean);

        if (renderedText.length === 0 && renderedBadges.length === 0) return null;

        return (
          <div className="bg-gray-50 border-t border-gray-200 rounded-b-[7px] flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3">
            {renderedText.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2 text-gray-400">
                {renderedText.map((el, i) => (
                  <span key={i} className="flex items-center gap-2">
                    {i > 0 && <span className="text-gray-300">|</span>}
                    {el}
                  </span>
                ))}
              </div>
            ) : <div />}
            {renderedBadges.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {renderedBadges}
              </div>
            )}
          </div>
        );
      })()}
    </Link>
  );
}
