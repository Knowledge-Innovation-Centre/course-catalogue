import { Link } from 'react-router-dom';
import type { CourseListItem } from './courseDataTypes';
import type { CourseCardField } from './configTypes';
import { useConfig } from './ConfigContext';
import { useFavorites } from './FavoritesContext';
import * as LucideIcons from 'lucide-react';
import { Heart } from 'lucide-react';

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

      case 'badge':
        return (
          <div key={field.key} className="flex gap-1.5 items-center">
            {IconComponent && <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />}
            <p className="font-normal text-xs sm:text-sm text-gray-900">{formattedValue}</p>
          </div>
        );

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
      className="flex flex-col sm:flex-row items-start overflow-clip rounded-lg shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] w-full hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 cursor-pointer sm:h-[140px] relative group"
    >
      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm hover:bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
        title={courseIsFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={`w-5 h-5 transition-all duration-200 ${
            courseIsFavorite
              ? 'fill-red-500 text-red-500'
              : 'text-gray-400 group-hover:text-red-400'
          }`}
        />
      </button>

      {/* Course Image */}
      {config.courseCard.image.enabled && (
        <div className="overflow-clip relative rounded-t-lg sm:rounded-t-none sm:rounded-bl-lg sm:rounded-tl-lg shrink-0 w-full sm:w-[200px]">
          <div className="h-[140px] sm:h-[140px] rounded-t-lg sm:rounded-t-none sm:rounded-bl-lg sm:rounded-tl-lg w-full sm:w-[200px]">
            <div className="overflow-hidden rounded-t-lg sm:rounded-t-none sm:rounded-bl-lg sm:rounded-tl-lg h-full">
              <img
                alt={toDisplayString(course.title) || 'Course image'}
                className="h-full w-full object-cover"
                src={course.imageUrl || config.courseCard.image.placeholder || ''}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const placeholder = config.courseCard.image.placeholder || '';
                  if (target.src !== placeholder && placeholder) {
                    target.src = placeholder;
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Course Content */}
      <div className="flex-1 bg-white border sm:border-l-0 border-gray-200 flex items-center p-4 sm:p-5 rounded-b-lg sm:rounded-b-none sm:rounded-br-lg sm:rounded-tr-lg w-full sm:h-full">
        <div className="flex-1 flex flex-col gap-2 sm:gap-3">
          <div className="flex flex-col gap-2 sm:gap-3">
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
                <div className="flex flex-wrap gap-1.5 items-center">
                  <div className="flex gap-1 items-center text-gray-900">
                    <p className="font-normal text-xs sm:text-sm">by</p>
                    {subheaderFields.map(field => {
                      const displayValue = toDisplayString(getValue(course, field.key));
                      if (!displayValue) return null;
                      return (
                        <p key={field.key} className={field.className || 'font-semibold text-xs sm:text-sm'}>
                          {displayValue}
                        </p>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Badge fields (ects, level, delivery mode, etc.) */}
            {badgeFields.length > 0 && (
              <div className="flex flex-wrap gap-2 items-start">
                {badgeFields.map(renderField)}
              </div>
            )}

            {/* Footer fields */}
            {footerFields.length > 0 && (
              <div className="flex flex-wrap gap-2 items-start mt-2">
                {footerFields.map(renderField)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
