import { useState, useEffect, useRef } from 'react';
import { FilterSidebar } from './FilterSidebar';
import { CourseCard } from './CourseCard';
import { theme } from './theme';
import { SlidersHorizontal, X, Heart, ArrowUpDown, Check } from 'lucide-react';
import { useConfig } from './ConfigContext';
import { useFavorites } from './FavoritesContext';
import { searchCourses, buildFilterString, type SearchParams } from './services/searchService';
import { fetchMultipleFacets } from './services/facetService';

const SORT_OPTIONS = [
  { label: 'Title (A-Z)', value: 'dcterms:title:asc' },
  { label: 'Title (Z-A)', value: 'dcterms:title:desc' },
  { label: 'ECTS (Low to High)', value: 'elm:creditPoint.elm:point:asc' },
  { label: 'ECTS (High to Low)', value: 'elm:creditPoint.elm:point:desc' },
];

const PAGE_SIZE = 4;

export function CataloguePage() {
  const [showFilters, setShowFilters] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<SearchParams['filters']>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const { config } = useConfig();
  const { favorites } = useFavorites();

  // Close sort dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [facetCounts, setFacetCounts] = useState<Record<string, Record<string, number>>>({});

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleFilterChange = (filterKey: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
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

  // Refresh facet counts when filters change (drill-down logic)
  useEffect(() => {
    if (!config) return;

    async function refreshFacets() {
      const facetEntries = Object.entries(config!.filters)
        .filter(([, f]) => f.enabled && (f.type === 'multiselect' || f.type === 'select'))
        .map(([key, f]) => ({ key, meilisearchField: (f as any).meilisearchField as string }))
        .filter(e => e.meilisearchField);

      if (facetEntries.length === 0) return;

      // For each facet, build a filter string excluding that facet's own filter
      const results = await Promise.all(
        facetEntries.map(({ key, meilisearchField }) => {
          const filtersWithoutSelf = { ...filters };
          delete filtersWithoutSelf[key];
          const filterString = buildFilterString(filtersWithoutSelf);
          return fetchMultipleFacets([meilisearchField], filterString);
        })
      );

      const countsMap: Record<string, Record<string, number>> = {};
      results.forEach((facets) => {
        Object.entries(facets).forEach(([field, hits]) => {
          countsMap[field] = {};
          hits.forEach(hit => {
            countsMap[field][hit.value] = hit.count;
          });
        });
      });
      setFacetCounts(countsMap);
    }

    refreshFacets();
  }, [config, filters, searchQuery]);

  // Fetch courses when filters, search query, page, or sort changes
  useEffect(() => {
    if (!config) return;

    async function fetchCourses() {
      if (initialLoad) setLoading(true);
      setError(null);

      try {
        const results = await searchCourses(
          {
            query: searchQuery,
            filters,
            page: currentPage,
            limit: PAGE_SIZE,
            sort: sortBy ? [sortBy] : undefined,
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
        setInitialLoad(false);
      }
    }

    fetchCourses();
  }, [config, filters, searchQuery, currentPage, sortBy]);

  return (
    <div className="bg-gray-50 w-full min-h-screen">
      {/* Main Content Area - with padding for fixed header */}
      <div className="flex flex-col items-center px-4 sm:px-8 lg:px-[100px] pt-[195px] sm:pt-[180px] lg:pt-[210px] pb-8 sm:pb-12 w-full">
        {/* Page Header - Fixed */}
        <div className="fixed top-[52px] left-0 right-0 z-20 bg-gray-50 flex justify-center px-4 sm:px-8 lg:px-[100px] pt-8 sm:pt-12 lg:pt-[60px] pb-4 sm:pb-6 lg:pb-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 max-w-[1240px] w-full">
            <div className="flex-1 flex flex-col min-w-0">
              <h1 className="font-semibold text-xl sm:text-2xl mb-0" style={{ color: theme.colors.primary }}>Catalogue</h1>
              <p className="font-normal text-xs sm:text-sm text-gray-700">
                {loading ? 'Loading...' : showFavoritesOnly
                  ? `Showing ${displayedCount} favorite ${displayedCount === 1 ? 'course' : 'courses'}`
                  : total > 0
                    ? `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, total)} of ${total} courses`
                    : 'No courses found'}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Sort */}
              <div className="relative" ref={sortRef}>
                <button
                  ref={sortButtonRef}
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-1.5 bg-white border border-gray-200 h-9 sm:h-[42px] px-3 sm:px-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-700">{SORT_OPTIONS.find(o => o.value === sortBy)?.label || 'Sort by'}</span>
                  <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${sortOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {sortOpen && (
                  <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden min-w-[180px]">
                    {SORT_OPTIONS.map((opt, index) => (
                      <button
                        key={opt.value}
                        onClick={() => { handleSortChange(sortBy === opt.value ? '' : opt.value); setSortOpen(false); }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2 hover:bg-gray-50 cursor-pointer ${
                          sortBy === opt.value ? 'bg-blue-50 font-medium' : 'text-gray-700'
                        } ${index === 0 ? 'rounded-t-lg' : ''} ${index === SORT_OPTIONS.length - 1 ? 'rounded-b-lg' : ''}`}
                        style={sortBy === opt.value ? { color: theme.colors.primary } : {}}
                      >
                        <Check className={`w-4 h-4 shrink-0 ${sortBy === opt.value ? '' : 'invisible'}`} />
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden bg-white border border-gray-200 h-9 sm:h-[42px] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-sm text-gray-900 hover:bg-gray-50 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2 relative"
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
                className={`bg-white border h-9 sm:h-[42px] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm hover:bg-gray-50 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
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
              <button className="hidden sm:flex bg-white border border-gray-200 h-9 sm:h-[42px] px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm text-gray-900 hover:bg-gray-50 active:scale-95 transition-all duration-200 cursor-pointer whitespace-nowrap items-center">
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
                    facetCounts={facetCounts}
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
              facetCounts={facetCounts}
            />
          </div>

          {/* Spacer for fixed sidebar - only on desktop */}
          <div className="hidden lg:block w-[328px] shrink-0"></div>

          {/* Course List */}
          <div className="flex-1 flex flex-col gap-3 w-full">
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

            <div key={`page-${currentPage}-${sortBy}`} className="flex flex-col gap-3">
              {courses
                .filter(course => !showFavoritesOnly || favorites.includes(course.id))
                .map((course, i) => (
                  <div
                    key={course.id}
                    className="animate-[fadeInUp_0.3s_ease-out_both]"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <CourseCard course={course} />
                  </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && !showFavoritesOnly && (
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <span>Page</span>
                  <select
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                    className="bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-900 cursor-pointer outline-none"
                  >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <option key={page} value={page}>{page}</option>
                    ))}
                  </select>
                  <span>of {totalPages}</span>
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
