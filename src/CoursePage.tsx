import type { CourseDetail } from './types';
import { TabNavigation } from './components/TabNavigation';
import { InfoCard } from './components/InfoCard';
import { theme } from './theme';

interface CoursePageProps {
  course: CourseDetail;
}

export function CoursePage({ course }: CoursePageProps) {
  return (
    <div className="bg-white w-full flex flex-col">
      {/* Header */}
      <div
        className="flex items-center justify-center h-[78px] px-[100px]"
        style={{ backgroundColor: theme.colors.primary }}
      >
        <div className="flex gap-3 items-center max-w-[1240px] w-full">
          <div className="h-9 w-[37px] relative shrink-0">
            <img
              alt={theme.logo.name}
              className="h-full w-full object-contain"
              src={theme.logo.url}
            />
          </div>
          <p className="flex-1 font-semibold text-xl text-white">
            {theme.logo.name}
          </p>
        </div>
      </div>

      {/* Hero Image */}
      <div className="bg-gray-50 w-full h-[219px] relative overflow-hidden">
        <img
          alt={course.title}
          className="w-full h-full object-cover"
          src={course.heroImageUrl}
        />
      </div>

      {/* Title Section */}
      <div className="bg-gray-50 flex justify-center px-[100px] py-[60px]">
        <div className="flex gap-12 items-start max-w-[1240px] w-full">
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="font-semibold text-2xl text-gray-900 leading-[1.5]">
                {course.title}
              </h1>
              <div className="flex gap-1.5 items-center text-base">
                <span className="font-normal text-gray-900">by</span>
                <a
                  href={course.universityLink}
                  className="font-semibold text-blue-600 underline hover:text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {course.university}
                </a>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="bg-white border border-gray-200 h-[42px] px-5 py-2.5 rounded-lg font-medium text-sm text-gray-900 hover:bg-gray-50 flex items-center gap-2">
              <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 1.5C4.5 1.5 2.5 3.5 2.5 6C2.5 9 7 12.5 7 12.5C7 12.5 11.5 9 11.5 6C11.5 3.5 9.5 1.5 7 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              Add to favourites
            </button>
            <button
              className="h-[42px] px-5 py-2.5 rounded-lg font-medium text-sm text-white hover:opacity-90"
              style={{ backgroundColor: theme.colors.primary }}
            >
              Enroll now
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-100 flex justify-center w-full">
        <div className="max-w-[1240px] w-full px-[100px]">
          <TabNavigation tabs={course.tabs} />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white flex justify-center px-[100px] py-[60px]">
        <div className="flex flex-col gap-[60px] max-w-[1240px] w-full">
          {/* Info Cards Grid */}
          <div className="flex flex-col gap-4">
            {/* First row - 3 cards */}
            <div className="grid grid-cols-3 gap-4">
              {course.infoCards.slice(0, 3).map((card, index) => (
                <InfoCard key={index} card={card} />
              ))}
            </div>
            {/* Second row - 3 cards */}
            <div className="grid grid-cols-3 gap-4">
              {course.infoCards.slice(3, 6).map((card, index) => (
                <InfoCard key={index + 3} card={card} />
              ))}
            </div>
          </div>

          {/* Detailed Information Sections */}
          <div className="flex flex-col gap-4">
            {/* Description */}
            <div className="flex gap-8">
              <p className="font-semibold text-base text-gray-500 tracking-wider uppercase w-[310px] shrink-0">
                DESCRIPTION
              </p>
              <p className="font-medium text-base text-gray-900 leading-[1.5] flex-1">
                {course.description}
              </p>
            </div>

            <div className="h-px bg-gray-200 w-full" />

            {/* Provider */}
            <div className="flex gap-8 items-center">
              <p className="font-semibold text-base text-gray-500 tracking-wider uppercase w-[310px] shrink-0 flex items-center gap-1">
                PROVIDER
                <span className="text-blue-600 font-bold">ⓘ</span>
              </p>
              <div className="flex items-center gap-4 flex-1">
                <span className="font-medium text-base text-gray-900">
                  {course.provider.name}
                </span>
                <a
                  href={course.provider.link}
                  className="flex items-center gap-1 text-blue-600 font-medium text-base underline hover:text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 15L15 5M15 5H9M15 5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="h-px bg-gray-200 w-full" />

            {/* Learning Outcomes */}
            <div className="flex gap-8">
              <p className="font-semibold text-base text-gray-500 tracking-wider uppercase w-[310px] shrink-0 flex items-center gap-1">
                LEARNING OUTCOMES
                <span className="text-blue-600 font-bold">ⓘ</span>
              </p>
              <ul className="flex-1 font-medium text-base text-gray-900 leading-[1.5] list-disc ml-6">
                {course.learningOutcomes.map((outcome, index) => (
                  <li key={index} className="mb-1">{outcome}</li>
                ))}
              </ul>
            </div>

            <div className="h-px bg-gray-200 w-full" />

            {/* Skills */}
            <div className="flex gap-8">
              <p className="font-semibold text-base text-gray-500 tracking-wider uppercase w-[310px] shrink-0 flex items-center gap-1">
                SKILLS
                <span className="text-blue-600 font-bold">ⓘ</span>
              </p>
              <div className="flex flex-col gap-2 flex-1">
                {course.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="font-medium text-base text-gray-900 list-disc ml-6 flex items-center before:content-['•'] before:mr-2">
                      {skill.name}
                    </span>
                    {skill.escoLink && (
                      <a
                        href={skill.escoLink}
                        className="flex items-center gap-1 text-blue-600 font-medium text-base underline hover:text-blue-700"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        ESCO
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 15L15 5M15 5H9M15 5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-200 w-full" />

            {/* Type of Assessment */}
            <div className="flex gap-8 items-center">
              <p className="font-semibold text-base text-gray-500 tracking-wider uppercase w-[310px] shrink-0 flex items-center gap-1">
                TYPE OF ASSESSMENT
                <span className="text-blue-600 font-bold">ⓘ</span>
              </p>
              <p className="font-medium text-base text-gray-900 leading-[1.5] flex-1">
                {course.typeOfAssessment}
              </p>
            </div>

            <div className="h-px bg-gray-200 w-full" />

            {/* Supervision and Identity Verification */}
            <div className="flex gap-8 items-center">
              <p className="font-semibold text-base text-gray-500 tracking-wider uppercase w-[310px] shrink-0 flex items-center gap-1">
                SUPERVISION AND IDENTITY VERIFICATION
                <span className="text-blue-600 font-bold">ⓘ</span>
              </p>
              <p className="font-medium text-base text-gray-900 leading-[1.5] flex-1">
                {course.supervisionAndIdentityVerification}
              </p>
            </div>

            <div className="h-px bg-gray-200 w-full" />

            {/* Form of Participation */}
            <div className="flex gap-8 items-center">
              <p className="font-semibold text-base text-gray-500 tracking-wider uppercase w-[310px] shrink-0 flex items-center gap-1">
                FORM OF PARTICIPATION
                <span className="text-blue-600 font-bold">ⓘ</span>
              </p>
              <p className="font-medium text-base text-gray-900 leading-[1.5] flex-1">
                {course.formOfParticipation}
              </p>
            </div>

            <div className="h-px bg-gray-200 w-full" />

            {/* Prerequisites */}
            <div className="flex gap-8 items-center">
              <p className="font-semibold text-base text-gray-500 tracking-wider uppercase w-[310px] shrink-0 flex items-center gap-1">
                PREREQUISITES
                <span className="text-blue-600 font-bold">ⓘ</span>
              </p>
              <p className="font-medium text-base text-gray-900 leading-[1.5] flex-1">
                {course.prerequisites}
              </p>
            </div>

            <div className="h-px bg-gray-200 w-full" />

            {/* Type of Credential Awarded */}
            <div className="flex gap-8 items-center">
              <p className="font-semibold text-base text-gray-500 tracking-wider uppercase w-[310px] shrink-0 flex items-center gap-1">
                TYPE OF CREDENTIAL AWARDED
                <span className="text-blue-600 font-bold">ⓘ</span>
              </p>
              <p className="font-medium text-base text-gray-900 leading-[1.5] flex-1">
                {course.typeOfCredentialAwarded}
              </p>
            </div>

            <div className="h-px bg-gray-200 w-full" />

            {/* Identifier */}
            <div className="flex gap-8 items-center">
              <p className="font-semibold text-base text-gray-500 tracking-wider uppercase w-[310px] shrink-0 flex items-center gap-1">
                IDENTIFIER
                <span className="text-blue-600 font-bold">ⓘ</span>
              </p>
              <p className="font-medium text-base text-gray-900 leading-[1.5] flex-1">
                {course.identifier}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
