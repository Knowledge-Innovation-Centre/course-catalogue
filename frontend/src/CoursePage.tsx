import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { CourseData } from "./courseDataTypes";
import { TabNavigation } from "./components/TabNavigation";
import { DynamicField } from "./components/DynamicField";
import { useConfig } from "./ConfigContext";
import { useFavorites } from "./FavoritesContext";
import { theme } from "./theme";
import { HeartIcon } from "lucide-react";
import { getCourseById } from "./services/searchService";

/**
 * Get field value from course data using dot notation key
 * Examples:
 * - getFieldValue(data, 'deliveryMode') => data.deliveryMode
 * - getFieldValue(data, 'provider.name') => data.provider.name
 */
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

/**
 * Convert any value to a displayable string
 * Handles primitives, arrays, and objects generically
 */
function toDisplayString(value: any): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') {
    if (value.startsWith('http://') || value.startsWith('https://')) return '';
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return '';
    if (typeof value[0] === 'string' || typeof value[0] === 'number') {
      return value.join(', ');
    }
    return toDisplayString(value[0]);
  }
  if (typeof value === 'object') {
    // Try common display property names in order of preference (including prefixed versions)
    const displayKeys = ['title', 'name', 'label', 'value', 'text', 'description', 'dcterms:title', 'dcterms:name', 'skos:prefLabel'];
    for (const key of displayKeys) {
      if (value[key] !== undefined) return toDisplayString(value[key]);
    }
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

export function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const { config } = useConfig();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !config) return;

    async function fetchCourse() {
      setLoading(true);
      setError(null);

      try {
        const course = await getCourseById(id!);
        setCourseData(course as CourseData);

        // Set first enabled tab as active
        const firstTab = config!.courseDetail.tabs.find(t => t.enabled);
        if (firstTab) {
          setActiveTabId(firstTab.id);
        }
      } catch (err) {
        console.error('Failed to fetch course:', err);
        setError('Course not found');
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [id, config]);

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" style={{ borderColor: theme.colors.primary }}></div>
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

  const activeTab = config.courseDetail.tabs.find(t => t.id === activeTabId);

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
    if (id) {
      toggleFavorite(id);
    }
  };

  const courseIsFavorite = id ? isFavorite(id) : false;

  return (
    <div className="bg-white w-full flex flex-col pt-[56px] sm:pt-[68px]">
      {/* Hero Image */}
      {(courseData as any).imageUrl && (
        <div className="bg-gray-50 w-full h-[140px] sm:h-[180px] lg:h-[219px] relative overflow-hidden">
          <img
            alt={(courseData as any)['dcterms:title'] || 'Course image'}
            className="w-full h-full object-cover object-center"
            src={(courseData as any).imageUrl}
          />
        </div>
      )}

      {/* Title Section */}
      <div className="bg-gray-50 flex justify-center px-4 sm:px-8 lg:px-[100px] py-8 sm:py-12 lg:py-[60px]">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start max-w-[1240px] w-full">
          <div className="flex-1 flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="font-semibold text-xl sm:text-2xl text-gray-900 leading-[1.5]">
                {(courseData as any)['dcterms:title'] || 'Untitled Course'}
              </h1>
              {(courseData as any).type && (
                <div className="flex gap-1.5 items-center text-sm sm:text-base">
                  <span className="font-normal text-gray-900">Publisher:</span>
                  <span className="font-semibold text-gray-900">
                    {(courseData as any).type.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={handleFavoriteClick}
              className={`h-[42px] px-5 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 border transition-all duration-500 cursor-pointer active:scale-95 ${
                courseIsFavorite
                  ? 'bg-white text-red-500 border-red-500 hover:bg-red-50'
                  : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <HeartIcon
                className={`w-4 h-4 transition-all duration-500 ${courseIsFavorite ? 'scale-110 fill-red-500 text-red-500' : ''}`}
              />
              {courseIsFavorite ? 'Favorited' : 'Add to favourites'}
            </button>
            <button
              className="h-[42px] px-5 py-2.5 rounded-lg font-medium text-sm text-white hover:opacity-90 hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
              style={{ backgroundColor: theme.colors.primary }}
            >
              Enroll now
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-100 flex justify-center w-full">
        <div className="max-w-[1240px] w-full px-4 sm:px-8 lg:px-0">
          <TabNavigation
            tabs={config.courseDetail.tabs}
            activeTabId={activeTabId}
            onTabClick={handleTabClick}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white flex justify-center px-4 sm:px-8 lg:px-[100px] py-8 sm:py-12 lg:py-[60px]">
        <div className="flex flex-col gap-10 sm:gap-12 lg:gap-[60px] max-w-[1240px] w-full">
          {/* Tab Content - Dynamic Sections */}
          <div
            className={`flex flex-col gap-10 sm:gap-12 lg:gap-[60px] transition-all duration-300 ${
              isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
            }`}
          >
            {activeTab?.sections.map((section, sectionIndex) => {
              // Check if all fields are info-cards for grid layout
              const allInfoCards = section.fields.every(f => f.type === 'info-card');

              return (
                <div key={section.id || sectionIndex} className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
                  {section.title && (
                    <h2 className="font-semibold text-lg sm:text-xl text-gray-900">
                      {section.title}
                    </h2>
                  )}

                  <div className={allInfoCards ? "flex flex-wrap gap-4 pb-10" : "flex flex-col gap-4"}>
                    {section.fields.map((fieldConfig, fieldIndex) => {
                      // Get value from course data using field key
                      const value = getFieldValue(courseData, fieldConfig.key);

                      // Don't render wrapper for empty values
                      if (value === undefined || value === null || value === '') {
                        return null;
                      }

                      if (allInfoCards) {
                        return (
                          <DynamicField key={fieldConfig.key || fieldIndex} config={fieldConfig} value={value} />
                        );
                      }

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
          </div>
        </div>
      </div>
    </div>
  );
}
