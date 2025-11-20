import { useState, useEffect } from 'react';
import { FilterSidebar } from './FilterSidebar';
import { CourseCard } from './CourseCard';
import { theme } from './theme';
import { SlidersHorizontal, X } from 'lucide-react';
import { useConfig } from './ConfigContext';
import { searchCourses, type SearchParams } from './services/searchService';

export function CataloguePage() {
  const [showFilters, setShowFilters] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<SearchParams['filters']>({});
  const [tempFilters, setTempFilters] = useState<SearchParams['filters']>({});
  const [searchQuery, setSearchQuery] = useState('');
  const { config } = useConfig();

  // Initialize temp filters when filters change
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const handleFilterChange = (filterKey: string, value: any) => {
    setTempFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {};
    setTempFilters(resetFilters);
    setFilters(resetFilters);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Fetch courses when filters or search query changes
  useEffect(() => {
    if (!config) return;

    async function fetchCourses() {
      setLoading(true);
      setError(null);

      try {
        const results = await searchCourses(
          {
            query: searchQuery,
            filters,
            page: 1,
            limit: 20,
          },
          config!
        );

        setCourses(results.courses);
        setTotal(results.total);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load courses. Please try again.');
        setCourses([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [config, filters, searchQuery]);

  return (
    <div className="bg-gray-50 w-full">
      {/* Main Content Area - with padding for fixed header */}
      <div className="flex flex-col items-center px-4 sm:px-8 lg:px-[100px] pt-[140px] sm:pt-[180px] lg:pt-[210px] pb-[60px] w-full">
        {/* Page Header - Fixed */}
        <div className="fixed top-[52px] left-0 right-0 z-20 bg-gray-50 flex justify-center px-4 sm:px-8 lg:px-[100px] pt-8 sm:pt-12 lg:pt-[60px] pb-4 sm:pb-6 lg:pb-8">
          <div className="flex items-start max-w-[1240px] w-full">
            <div className="flex-1 flex flex-col">
              <h1 className="font-semibold text-xl sm:text-2xl mb-0" style={{ color: theme.colors.primary }}>Catalogue</h1>
              <p className="font-normal text-xs sm:text-sm text-gray-700">
                {loading ? 'Loading...' : `Showing ${total} courses`}
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden bg-white border border-gray-200 h-[38px] sm:h-[42px] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-sm text-gray-900 hover:bg-gray-50 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              <button className="bg-white border border-gray-200 h-[38px] sm:h-[42px] px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm text-gray-900 hover:bg-gray-50 active:scale-95 transition-all duration-200 cursor-pointer whitespace-nowrap">
                Compare courses
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-4 lg:gap-8 items-start max-w-[1240px] w-full relative">
          {/* Mobile Filter Overlay */}
          {showFilters && (
            <div
              className="lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
              onClick={() => setShowFilters(false)}
            >
              <div
                className="absolute top-0 left-0 h-screen bg-white w-[85%] sm:w-[400px] transition-transform duration-300 flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shrink-0">
                  <h2 className="font-semibold text-lg">Filters</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto bg-gray-50">
                  <FilterSidebar
                    isMobile
                    filterValues={tempFilters}
                    onFilterChange={handleFilterChange}
                    onSearchChange={handleSearchChange}
                  />
                </div>
                <div className="bg-white border-t border-gray-200 p-4 shrink-0">
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={handleResetFilters}
                      className="bg-white border border-gray-200 h-10 px-3 py-2 rounded-lg font-medium text-xs text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all duration-200 cursor-pointer"
                    >
                      Reset all
                    </button>
                    <button
                      className="flex-1 h-10 px-3 py-2 rounded-lg font-medium text-xs text-white hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer"
                      style={{ backgroundColor: theme.colors.primary }}
                      onClick={handleApplyFilters}
                    >
                      Apply filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Sidebar - Fixed */}
          <div className="hidden lg:block fixed top-[212px] z-10">
            <FilterSidebar
              filterValues={tempFilters}
              onFilterChange={handleFilterChange}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
              onSearchChange={handleSearchChange}
            />
          </div>

          {/* Spacer for fixed sidebar - only on desktop */}
          <div className="hidden lg:block w-[328px] shrink-0"></div>

          {/* Course List - Scrollable */}
          <div className="flex-1 flex flex-col gap-3 pb-16 w-full">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}

            {loading && courses.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" style={{ borderColor: theme.colors.primary }}></div>
              </div>
            )}

            {!loading && courses.length === 0 && !error && (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-600">
                No courses found. Try adjusting your filters.
              </div>
            )}

            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
