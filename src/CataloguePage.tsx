import { Header } from './Header';
import { FilterSidebar } from './FilterSidebar';
import { CourseCard } from './CourseCard';
import { mockCourses } from './mockData';
import { theme } from './theme';

export function CataloguePage() {
  return (
    <div className="bg-gray-50 w-full">
      {/* Navigation Header - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-gray-50">
        <Header />
      </div>

      {/* Main Content Area - with padding for fixed header */}
      <div className="flex flex-col items-center px-[100px] pt-[210px] pb-[60px] w-full">
        {/* Page Header - Fixed */}
        <div className="fixed top-[52px] left-0 right-0 z-20 bg-gray-50 flex justify-center px-[100px] pt-[60px] pb-8">
          <div className="flex items-start max-w-[1240px] w-full">
            <div className="flex-1 flex flex-col">
              <h1 className="font-semibold text-2xl mb-0" style={{ color: theme.colors.primary }}>Catalogue</h1>
              <p className="font-normal text-sm text-gray-700">Showing {mockCourses.length} courses</p>
            </div>
            <div className="flex flex-col">
              <button className="bg-white border border-gray-200 h-[42px] px-5 py-2.5 rounded-lg font-medium text-sm text-gray-900 hover:bg-gray-50 active:scale-95 transition-all duration-200 cursor-pointer">
                Compare courses
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-8 items-start max-w-[1240px] w-full">
          {/* Sidebar - Fixed */}
          <div className="fixed top-[212px] z-10">
            <FilterSidebar />
          </div>

          {/* Spacer for fixed sidebar */}
          <div className="w-[328px] shrink-0"></div>

          {/* Course List - Scrollable */}
          <div className="flex-1 flex flex-col gap-3 pb-16">
            {mockCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
