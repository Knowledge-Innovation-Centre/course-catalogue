import { useState } from 'react';
import { Header } from './Header';
import { FilterSidebar } from './FilterSidebar';
import { CourseCard } from './CourseCard';
import { mockCourses } from './mockData';
import { theme } from './theme';
import { SlidersHorizontal, X } from 'lucide-react';

export function CataloguePage() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-gray-50 w-full">
      {/* Navigation Header - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-gray-50">
        <Header />
      </div>

      {/* Main Content Area - with padding for fixed header */}
      <div className="flex flex-col items-center px-4 sm:px-8 lg:px-[100px] pt-[140px] sm:pt-[180px] lg:pt-[210px] pb-[60px] w-full">
        {/* Page Header - Fixed */}
        <div className="fixed top-[52px] left-0 right-0 z-20 bg-gray-50 flex justify-center px-4 sm:px-8 lg:px-[100px] pt-8 sm:pt-12 lg:pt-[60px] pb-4 sm:pb-6 lg:pb-8">
          <div className="flex items-start max-w-[1240px] w-full">
            <div className="flex-1 flex flex-col">
              <h1 className="font-semibold text-xl sm:text-2xl mb-0" style={{ color: theme.colors.primary }}>Catalogue</h1>
              <p className="font-normal text-xs sm:text-sm text-gray-700">Showing {mockCourses.length} courses</p>
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
                  <FilterSidebar isMobile />
                </div>
                <div className="bg-white border-t border-gray-200 p-4 shrink-0">
                  <div className="flex gap-2 w-full">
                    <button className="bg-white border border-gray-200 h-10 px-3 py-2 rounded-lg font-medium text-xs text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all duration-200 cursor-pointer">
                      Reset all
                    </button>
                    <button
                      className="flex-1 h-10 px-3 py-2 rounded-lg font-medium text-xs text-white hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer"
                      style={{ backgroundColor: theme.colors.primary }}
                      onClick={() => setShowFilters(false)}
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
            <FilterSidebar />
          </div>

          {/* Spacer for fixed sidebar - only on desktop */}
          <div className="hidden lg:block w-[328px] shrink-0"></div>

          {/* Course List - Scrollable */}
          <div className="flex-1 flex flex-col gap-3 pb-16 w-full">
            {mockCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
