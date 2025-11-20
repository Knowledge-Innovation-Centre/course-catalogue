import { Link } from 'react-router-dom';
import type { CourseListItem } from './courseDataTypes';
import type { CourseCardField } from './configTypes';
import { useConfig } from './ConfigContext';
import * as LucideIcons from 'lucide-react';

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
 * Format field value using format template
 */
function formatValue(format: string, value: any): string {
  if (!format) return String(value);
  return format.replace('{value}', String(value));
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

  if (!config) return null;

  // Group fields by position
  const headerFields = config.courseCard.fields.filter(f => f.position === 'header');
  const subheaderFields = config.courseCard.fields.filter(f => f.position === 'subheader');
  const badgeFields = config.courseCard.fields.filter(f => f.position === 'badges');
  const footerFields = config.courseCard.fields.filter(f => f.position === 'footer');

  const renderField = (field: CourseCardField) => {
    const value = getValue(course, field.key);

    // Don't render if no value
    if (value === undefined || value === null || value === '') {
      return null;
    }

    const formattedValue = formatValue(field.format, value);

    // Get icon - use iconMap if available, otherwise use field icon
    let iconName = field.icon;
    if (field.iconMap && field.iconMap[value]) {
      iconName = field.iconMap[value];
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

  return (
    <Link
      to={`/course/${course.id}`}
      className="flex flex-col sm:flex-row items-start overflow-clip rounded-lg shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] w-full hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 cursor-pointer sm:h-[140px]"
    >
      {/* Course Image */}
      {config.courseCard.image.enabled && (
        <div className="overflow-clip relative rounded-t-lg sm:rounded-t-none sm:rounded-bl-lg sm:rounded-tl-lg shrink-0 w-full sm:w-[200px]">
          <div className="h-[140px] sm:h-[140px] rounded-t-lg sm:rounded-t-none sm:rounded-bl-lg sm:rounded-tl-lg w-full sm:w-[200px]">
            <div className="overflow-hidden rounded-t-lg sm:rounded-t-none sm:rounded-bl-lg sm:rounded-tl-lg h-full">
              <img
                alt={course.title}
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
              {headerFields.map(field => (
                <p
                  key={field.key}
                  className={field.className || 'font-semibold text-base sm:text-lg text-gray-900 tracking-tight'}
                >
                  {getValue(course, field.key)}
                </p>
              ))}

              {/* Subheader fields (university, etc.) */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <div className="flex gap-1 items-center text-gray-900">
                  <p className="font-normal text-xs sm:text-sm">by</p>
                  {subheaderFields.map(field => (
                    <p key={field.key} className={field.className || 'font-semibold text-xs sm:text-sm'}>
                      {getValue(course, field.key)}
                    </p>
                  ))}
                </div>
              </div>
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
