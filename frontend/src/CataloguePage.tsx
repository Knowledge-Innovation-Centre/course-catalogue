import { useState, useEffect } from 'react';
import { FilterSidebar } from './FilterSidebar';
import { CourseCard } from './CourseCard';
import { theme } from './theme';
import { SlidersHorizontal, X, Heart } from 'lucide-react';
import { useConfig } from './ConfigContext';
import { useFavorites } from './FavoritesContext';
import { searchCourses, type SearchParams } from './services/searchService';

export function CataloguePage() {
  const [showFilters, setShowFilters] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<SearchParams['filters']>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { config } = useConfig();
  const { favorites } = useFavorites();

  const handleFilterChange = (filterKey: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Count active filters
  const countActiveFilters = (filterValues: SearchParams['filters'] = {}) => {
    return Object.values(filterValues).filter(value => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value.length > 0;
      if (typeof value === 'number') return true;
      return value !== undefined && value !== null;
    }).length;
  };

  const activeFiltersCount = countActiveFilters(filters);

  // Calculate displayed courses count
  const displayedCourses = showFavoritesOnly
    ? courses.filter(course => favorites.includes(course.id))
    : courses;
  const displayedCount = displayedCourses.length;

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
    <div className="bg-gray-50 w-full min-h-screen">
      {/* Main Content Area - with padding for fixed header */}
      <div className="flex flex-col items-center px-4 sm:px-8 lg:px-[100px] pt-[140px] sm:pt-[180px] lg:pt-[210px] pb-[60px] w-full min-h-screen">
        {/* Page Header - Fixed */}
        <div className="fixed top-[52px] left-0 right-0 z-20 bg-gray-50 flex justify-center px-4 sm:px-8 lg:px-[100px] pt-8 sm:pt-12 lg:pt-[60px] pb-4 sm:pb-6 lg:pb-8">
          <div className="flex items-start max-w-[1240px] w-full">
            <div className="flex-1 flex flex-col">
              <h1 className="font-semibold text-xl sm:text-2xl mb-0" style={{ color: theme.colors.primary }}>Catalogue</h1>
              <p className="font-normal text-xs sm:text-sm text-gray-700">
                {loading ? 'Loading...' : showFavoritesOnly
                  ? `Showing ${displayedCount} favorite ${displayedCount === 1 ? 'course' : 'courses'}`
                  : `Showing ${total} courses`}
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden bg-white border border-gray-200 h-[38px] sm:h-[42px] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-sm text-gray-900 hover:bg-gray-50 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2 relative"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              {/* Favorites Toggle */}
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`bg-white border h-[38px] sm:h-[42px] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm hover:bg-gray-50 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  showFavoritesOnly
                    ? 'border-red-500 text-red-500'
                    : 'border-gray-200 text-gray-900'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${showFavoritesOnly ? 'fill-red-500' : ''}`}
                />
                <span className="hidden sm:inline">Favorites</span>
                {favorites.length > 0 && (
                  <span className="text-xs font-normal text-gray-500">
                    ({favorites.length})
                  </span>
                )}
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
                    filterValues={filters}
                    onFilterChange={handleFilterChange}
                    onSearchChange={handleSearchChange}
                    onResetFilters={handleResetFilters}
                    activeFiltersCount={activeFiltersCount}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Desktop Sidebar - Fixed */}
          <div className="hidden lg:block fixed top-[212px] z-10">
            <FilterSidebar
              filterValues={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              onSearchChange={handleSearchChange}
              activeFiltersCount={activeFiltersCount}
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

            {!loading && courses.length > 0 && displayedCount === 0 && showFavoritesOnly && (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-600">
                No favorite courses found. Add courses to your favorites to see them here.
              </div>
            )}

            {courses
              .filter(course => !showFavoritesOnly || favorites.includes(course.id))
              .map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
