import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { CourseData } from "./courseDataTypes";
import { DynamicField } from "./components/DynamicField";
import { useConfig } from "./ConfigContext";
import { useFavorites } from "./FavoritesContext";
import { theme } from "./theme";
import { Star, ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { getCourseById } from "./services/searchService";

function getFieldValue(data: any, key: string): any {
  if (!key || !data) return undefined;
  const keys = key.split('.');
  let value = data;
  for (const k of keys) {
    if (value === undefined || value === null) return undefined;
    value = value[k];
  }
  return value;
}

function toDisplay(value: any): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.length ? toDisplay(value[0]) : '';
  if (typeof value === 'object') {
    const keys = ['skos:prefLabel', 'dcterms:title', 'title', 'name', 'label', 'value', 'skos:notation'];
    for (const k of keys) if (value[k] !== undefined) return toDisplay(value[k]);
  }
  return '';
}

function formatTemplate(format: string | undefined, val: string): string {
  if (!format) return val;
  return format.replace('{value}', val);
}

function getLucideIcon(iconName?: string) {
  if (!iconName) return null;
  const icons = LucideIcons as any;
  const pascal = iconName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  return icons[pascal] || null;
}

export function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { config } = useConfig();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  useEffect(() => {
    if (!id || !config) return;
    async function fetchCourse() {
      setLoading(true);
      setError(null);
      try {
        const course = await getCourseById(id!);
        setCourseData(course as CourseData);
        const firstTab = config!.courseDetail.tabs.find(t => t.enabled);
        if (firstTab) setActiveTabId(firstTab.id);
      } catch (err) {
        console.error('Failed to fetch course:', err);
        setError('Course not found');
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [id, config]);

  const activeTab = useMemo(
    () => config?.courseDetail.tabs.find(t => t.id === activeTabId),
    [config, activeTabId]
  );

  const tocItems = useMemo(() => {
    if (!activeTab) return [];
    return activeTab.sections
      .filter(s => s.title)
      .map(s => ({ id: s.id, title: s.title! }));
  }, [activeTab]);

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: theme.colors.accent }}></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <p className="text-red-700 text-lg font-semibold mb-2">Course Not Found</p>
            <p className="text-red-600">{error || 'The requested course could not be loaded.'}</p>
          </div>
        </div>
      </div>
    );
  }

  const handleTabClick = (tabId: string) => {
    if (tabId !== activeTabId) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTabId(tabId);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handleFavoriteClick = () => {
    if (id) toggleFavorite(id);
  };

  const courseIsFavorite = id ? isFavorite(id) : false;
  const enrolLink = getFieldValue(courseData, 'elm:homepage') || getFieldValue(courseData, 'ql:courseUrl');
  const isActive = String(getFieldValue(courseData, 'ql:isActive')) === 'true';
  const altName = getFieldValue(courseData, 'elm:alternativeTitle') || getFieldValue(courseData, 'dcterms:alternative');
  const title = toDisplay(getFieldValue(courseData, 'dcterms:title')) || 'Untitled Course';
  const publisher = toDisplay(getFieldValue(courseData, 'dcterms:publisher'));

  // Build header chips from the first info-card section (if present), or fall back to all info-card fields
  const infoCardSection = config.courseDetail.tabs
    .flatMap(t => t.sections)
    .find(s => s.fields.every(f => f.type === 'info-card'));
  const headerChipFields = infoCardSection?.fields.filter(f => f.type === 'info-card') ?? [];

  const tabHasContent = (tab: typeof config.courseDetail.tabs[number]) => {
    for (const section of tab.sections) {
      // Info-card-only sections render in the header, not in the tab body
      if (section.fields.every(f => f.type === 'info-card')) continue;
      for (const field of section.fields) {
        const v = getFieldValue(courseData, field.key);
        if (v !== undefined && v !== null && v !== '') return true;
      }
    }
    return false;
  };

  const enabledTabs = config.courseDetail.tabs.filter(t => t.enabled && tabHasContent(t));

  return (
    <div className="bg-white w-full flex flex-col pt-[56px] sm:pt-[68px]">
      {/* Page container */}
      <div className="flex justify-center px-4 sm:px-8 lg:px-10 py-8 sm:py-12 lg:py-[60px]">
        <div className="flex flex-col gap-10 sm:gap-12 lg:gap-[60px] max-w-[1240px] w-full">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer self-start -mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to catalogue
          </button>

          {/* Header Card */}
          <div
            className="border border-gray-200 rounded-lg overflow-hidden flex flex-col"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(243, 244, 246, 0.6) 2px, transparent 2px)',
              backgroundSize: '14px 14px',
            }}
          >
            <div className="px-6 sm:px-8 pt-6 sm:pt-8 flex flex-col gap-6 sm:gap-8">
              {/* Title block */}
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-4">
                  <h1 className="flex-1 font-bold text-2xl sm:text-[28px] text-gray-900 leading-[1.2]">
                    {title}
                  </h1>
                  <button
                    onClick={handleFavoriteClick}
                    className="shrink-0 w-9 h-9 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label={courseIsFavorite ? 'Remove from favourites' : 'Add to favourites'}
                  >
                    <Star
                      className="w-4 h-4 transition-all"
                      style={{
                        color: theme.colors.accent,
                        fill: courseIsFavorite ? theme.colors.accent : 'none',
                      }}
                    />
                  </button>
                </div>
                {altName && (
                  <p className="text-sm text-gray-500">
                    <span>Also known as: </span>
                    <span>{toDisplay(altName)}</span>
                  </p>
                )}
                {publisher && (
                  <p className="text-sm font-medium text-gray-500">{publisher}</p>
                )}
              </div>

              {/* Chip badges */}
              {headerChipFields.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {headerChipFields.map(field => {
                    // Skip status field in chips — shown as enrolment badge instead
                    if (field.key === 'ql:isActive') return null;
                    const rawValue = getFieldValue(courseData, field.key);
                    if (rawValue === undefined || rawValue === null || rawValue === '') return null;
                    const displayValue = toDisplay(rawValue);
                    if (!displayValue) return null;
                    const mapped = field.valueMap && field.valueMap[displayValue] ? field.valueMap[displayValue] : displayValue;
                    const formatted = formatTemplate((field as any).format, mapped);
                    const Icon = getLucideIcon(field.icon);
                    return (
                      <div key={field.key} className="flex items-center gap-2 px-2.5 py-0.5 bg-white rounded border border-gray-200">
                        {Icon && <Icon className="w-3 h-3 shrink-0" style={{ color: theme.colors.accent }} />}
                        <span className="text-sm">
                          <span className="text-gray-500 font-normal">{field.label}: </span>
                          <span className="text-gray-900 font-medium">{formatted}</span>
                        </span>
                      </div>
                    );
                  })}

                  {/* Enrolment status pill */}
                  {isActive && (
                    <a
                      href={enrolLink || '#'}
                      target={enrolLink ? '_blank' : undefined}
                      rel={enrolLink ? 'noopener noreferrer' : undefined}
                      className={`flex items-center gap-2 px-2.5 py-0.5 bg-green-700 rounded text-sm font-medium text-white hover:bg-green-800 transition-colors no-underline ${enrolLink ? '' : 'pointer-events-none'}`}
                    >
                      <span
                        className="w-2.5 h-2.5 bg-green-300 rounded-full outline outline-2 -outline-offset-1 outline-green-400"
                        style={{ boxShadow: '0 0 12px 0 rgba(168, 255, 226, 0.8)' }}
                      />
                      <span>Enrolment open</span>
                      {enrolLink && (
                        <>
                          <span className="text-green-100">·</span>
                          <span className="text-green-100 font-normal">View sessions</span>
                          <ArrowRight className="w-3 h-3 text-green-200" />
                        </>
                      )}
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex items-end overflow-x-auto scrollbar-hide mt-6 sm:mt-8 px-6 sm:px-8">
              {enabledTabs.map(tab => {
                const active = tab.id === activeTabId;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`px-4 sm:px-6 py-3 rounded-t-lg text-sm font-medium cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                      active ? 'text-white' : 'text-gray-500 hover:text-gray-900'
                    }`}
                    style={active ? { backgroundColor: theme.colors.accent } : undefined}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main two-column content */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-[60px] items-start">
            {/* Main column */}
            <div className={`flex-1 flex flex-col gap-10 sm:gap-12 lg:gap-[60px] w-full transition-all duration-300 ${
              isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
            }`}>
              {activeTab?.sections.map((section, sectionIndex) => {
                const allInfoCards = section.fields.every(f => f.type === 'info-card');
                // Skip the info-cards section since we show those as chips in the header
                if (allInfoCards) return null;

                return (
                  <div
                    key={section.id || sectionIndex}
                    id={section.id}
                    className="flex flex-col gap-4 scroll-mt-24"
                  >
                    {section.title && (
                      <h2 className="font-semibold text-[22px] text-gray-900 leading-[33px]">
                        {section.title}
                      </h2>
                    )}
                    <div className="flex flex-col gap-4">
                      {section.fields.map((fieldConfig, fieldIndex) => {
                        const value = getFieldValue(courseData, fieldConfig.key);
                        if (value === undefined || value === null || value === '') return null;
                        return (
                          <div key={fieldConfig.key || fieldIndex}>
                            <DynamicField config={fieldConfig} value={value} />
                            {fieldIndex < section.fields.length - 1 && (
                              <div className="h-px bg-gray-200 w-full mt-4" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Interested in enroling CTA */}
              {isActive && (
                <div
                  className="rounded-lg shadow-md p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8"
                  style={{ backgroundColor: theme.colors.accent }}
                >
                  <div className="flex-1 flex flex-col gap-0.5">
                    <p className="text-white text-[22px] font-semibold leading-[33px]">Interested in enroling?</p>
                    <p className="text-sm">
                      <span className="text-white/80 font-normal">Check sessions and apply directly with the institution.</span>
                    </p>
                  </div>
                  {enrolLink ? (
                    <a
                      href={enrolLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-[37px] px-3 py-2 bg-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors no-underline whitespace-nowrap self-start sm:self-center"
                    >
                      Visit course
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : null}
                </div>
              )}
            </div>

            {/* On this page sidebar (desktop only) */}
            {tocItems.length > 0 && (
              <aside className="hidden lg:block w-[342px] shrink-0 sticky top-[80px]">
                <div className="p-4 bg-white rounded-lg border-l border-r border-t border-b-[3px] border-gray-200 flex flex-col gap-4">
                  <p className="text-gray-500 text-lg font-semibold leading-[27px]">On this page</p>
                  <ul className="flex flex-col gap-3">
                    {tocItems.map(item => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="text-sm text-gray-700 hover:text-gray-900 transition-colors no-underline"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
