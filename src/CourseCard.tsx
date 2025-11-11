import { Link } from 'react-router-dom';
import type { Course } from './types.js';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      to={`/course/${course.id}`}
      className="flex items-start overflow-clip rounded-lg shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] w-full hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="overflow-clip relative rounded-bl-lg rounded-tl-lg shrink-0 w-[200px]">
        <div className="h-[140px] rounded-bl-lg rounded-tl-lg w-[200px]">
          <div className="overflow-hidden rounded-bl-lg rounded-tl-lg h-full">
            <img
              alt="Lock your Screen when You're AFK DUDE"
              className="h-full w-full object-cover"
              src={course.imageUrl}
            />
          </div>
        </div>
      </div>
      <div className="flex-1 bg-white border border-l-0 border-gray-200 flex items-center p-5 rounded-br-lg rounded-tr-lg h-full">
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-lg text-gray-900 tracking-tight">
                {course.title}
              </p>
              <div className="flex flex-wrap gap-1.5 items-center">
                <div className="flex gap-1 items-center text-gray-900">
                  <p className="font-normal text-sm">by</p>
                  <p className="font-semibold text-sm">{course.university}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-start">
              <div className="flex gap-1.5 items-center">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 5V10L13 13" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="10" cy="10" r="7.5" stroke="#9CA3AF" strokeWidth="1.5"/>
                </svg>
                <p className="font-normal text-sm text-gray-900">{course.ects} ECTS</p>
              </div>
              <div className="flex gap-1.5 items-center">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="7" y="7" width="2" height="6" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
                  <rect x="11" y="5" width="2" height="8" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <p className="font-normal text-sm text-gray-900">EQF {course.eqfLevel}</p>
              </div>
              <div className="flex gap-1.5 items-center">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="14" height="10" rx="1" stroke="#9CA3AF" strokeWidth="1.5"/>
                  <path d="M7 14V16H13V14" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <p className="font-normal text-sm text-gray-900">{course.deliveryMode}</p>
              </div>
              <div className="flex gap-1.5 items-center">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 17C10 17 16 13 16 8.5C16 5.5 13.5 4 10 4C6.5 4 4 5.5 4 8.5C4 13 10 17 10 17Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinejoin="round"/>
                  <circle cx="10" cy="8.5" r="1.5" fill="#9CA3AF"/>
                </svg>
                <p className="font-normal text-sm text-gray-900">{course.deliveryMode}</p>
              </div>
              <div className="flex gap-1.5 items-center">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2Z" fill="#9CA3AF"/>
                  <path d="M10 5V10L13 11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <p className="font-normal text-sm text-gray-900">{course.language}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
