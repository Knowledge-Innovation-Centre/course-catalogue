import { Link } from 'react-router-dom';
import type { Course } from './types.js';
import { Clock, BarChart3, Monitor, MapPin, Languages } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      to={`/course/${course.id}`}
      className="flex flex-col sm:flex-row items-start overflow-clip rounded-lg shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] w-full hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 cursor-pointer sm:h-[140px]"
    >
      <div className="overflow-clip relative rounded-t-lg sm:rounded-t-none sm:rounded-bl-lg sm:rounded-tl-lg shrink-0 w-full sm:w-[200px]">
        <div className="h-[140px] sm:h-[140px] rounded-t-lg sm:rounded-t-none sm:rounded-bl-lg sm:rounded-tl-lg w-full sm:w-[200px]">
          <div className="overflow-hidden rounded-t-lg sm:rounded-t-none sm:rounded-bl-lg sm:rounded-tl-lg h-full">
            <img
              alt={course.title}
              className="h-full w-full object-cover"
              src={course.imageUrl}
            />
          </div>
        </div>
      </div>
      <div className="flex-1 bg-white border sm:border-l-0 border-gray-200 flex items-center p-4 sm:p-5 rounded-b-lg sm:rounded-b-none sm:rounded-br-lg sm:rounded-tr-lg w-full sm:h-full">
        <div className="flex-1 flex flex-col gap-2 sm:gap-3">
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-base sm:text-lg text-gray-900 tracking-tight">
                {course.title}
              </p>
              <div className="flex flex-wrap gap-1.5 items-center">
                <div className="flex gap-1 items-center text-gray-900">
                  <p className="font-normal text-xs sm:text-sm">by</p>
                  <p className="font-semibold text-xs sm:text-sm">{course.university}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-start">
              <div className="flex gap-1.5 items-center">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                <p className="font-normal text-xs sm:text-sm text-gray-900">{course.ects} ECTS</p>
              </div>
              <div className="flex gap-1.5 items-center">
                <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                <p className="font-normal text-xs sm:text-sm text-gray-900">EQF {course.eqfLevel}</p>
              </div>
              <div className="flex gap-1.5 items-center">
                <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                <p className="font-normal text-xs sm:text-sm text-gray-900">{course.deliveryMode}</p>
              </div>
              <div className="flex gap-1.5 items-center">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                <p className="font-normal text-xs sm:text-sm text-gray-900">{course.deliveryMode}</p>
              </div>
              <div className="flex gap-1.5 items-center">
                <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                <p className="font-normal text-xs sm:text-sm text-gray-900">{course.language}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
