import { useState } from 'react';
import type { CourseDetail, ContentSection, Skill, QualityIndicatorSection, InfoCard as InfoCardType } from './types';
import { TabNavigation } from './components/TabNavigation';
import { InfoCard } from './components/InfoCard';
import { theme } from './theme';
import { HeartIcon, Info, ExternalLink } from 'lucide-react';

interface CoursePageProps {
  course: CourseDetail;
}

function renderContentSection(section: ContentSection, index: number) {
  const labelElement = (
    <p className="font-semibold text-base text-gray-500 tracking-wider uppercase w-[310px] shrink-0 flex items-center gap-1">
      {section.label}
      {section.hasTooltip && (
        <Info className="w-4 h-4 text-blue-600" />
      )}
    </p>
  );

  switch (section.type) {
    case 'text':
      return (
        <div key={index} className="flex gap-8 items-center">
          {labelElement}
          <p className="font-medium text-base text-gray-900 leading-[1.5] flex-1">
            {section.data as string}
          </p>
        </div>
      );

    case 'list':
      return (
        <div key={index} className="flex gap-8">
          {labelElement}
          <ul className="flex-1 font-medium text-base text-gray-900 leading-[1.5] list-disc ml-6">
            {(section.data as string[]).map((item, i) => (
              <li key={i} className="mb-1">{item}</li>
            ))}
          </ul>
        </div>
      );

    case 'provider':
      const providerData = section.data as { name: string; link: string };
      return (
        <div key={index} className="flex gap-8 items-center">
          {labelElement}
          <div className="flex items-center gap-4 flex-1">
            <span className="font-medium text-base text-gray-900">
              {providerData.name}
            </span>
            <a
              href={providerData.link}
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
      );

    case 'skills':
      const skills = section.data as Skill[];
      return (
        <div key={index} className="flex gap-8">
          {labelElement}
          <div className="flex flex-col gap-2 flex-1">
            {skills.map((skill, i) => (
              <div key={i} className="flex items-center gap-4">
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
      );

    case 'link':
      const linkData = section.data as { text: string; linkText: string; linkUrl: string };
      return (
        <div key={index} className="flex gap-8 items-center">
          {labelElement}
          <div className="flex items-center gap-4 flex-1">
            <span className="font-medium text-base text-gray-900">
              {linkData.text}
            </span>
            <a
              href={linkData.linkUrl}
              className="flex items-center gap-1 text-blue-600 font-medium text-base underline hover:text-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkData.linkText}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      );

    case 'info-cards':
      const infoCards = section.data as InfoCardType[];
      return (
        <div key={index} className="flex flex-wrap gap-4">
          {infoCards.map((card, cardIdx) => (
            <InfoCard key={cardIdx} card={card} />
          ))}
        </div>
      );

    case 'quality-indicators':
      const sections = section.data as QualityIndicatorSection[];
      return (
        <div key={index} className="flex flex-col gap-[60px]">
          {sections.map((qualitySection, sectionIdx) => (
            <div key={sectionIdx} className="flex flex-col gap-10">
              <h2 className="font-semibold text-xl text-gray-900">
                {qualitySection.title}
              </h2>
              <div className="flex flex-col gap-4">
                {qualitySection.fields.map((field, fieldIdx) => (
                  <>
                    <div key={fieldIdx} className="flex gap-8 items-start">
                      <div className="flex flex-col gap-1 w-[488px] shrink-0">
                        <p className="font-semibold text-base text-gray-500 tracking-wider uppercase flex items-center gap-1">
                          {field.label}
                          {field.hasTooltip && (
                            <Info className="w-4 h-4 text-blue-600" />
                          )}
                        </p>
                        {field.subtitle && (
                          <p className="font-medium text-sm text-gray-500 tracking-[0.56px]">
                            {field.subtitle}
                          </p>
                        )}
                      </div>
                      <div className="flex-1 flex items-start gap-4">
                        {Array.isArray(field.value) ? (
                          <div className="font-medium text-base text-gray-900 leading-[1.5]">
                            {field.value.map((item, itemIdx) => (
                              <p key={itemIdx} className="mb-0">
                                {item}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <span className="font-medium text-base text-gray-900 leading-[1.5]">
                            {field.value}
                          </span>
                        )}
                        {field.linkText && field.linkUrl && (
                          <a
                            href={field.linkUrl}
                            className="flex items-center gap-1 text-blue-600 font-medium text-base underline hover:text-blue-700 whitespace-nowrap"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {field.linkText}
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    {fieldIdx < qualitySection.fields.length - 1 && (
                      <div className="h-px bg-gray-200 w-full" />
                    )}
                  </>
                ))}
              </div>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}

export function CoursePage({ course }: CoursePageProps) {
  const [activeTabId, setActiveTabId] = useState(
    course.tabs.find(tab => tab.active)?.id || course.tabs[0].id
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activeTab = course.tabs.find(tab => tab.id === activeTabId) || course.tabs[0];

  const handleTabClick = (tabId: string) => {
    if (tabId !== activeTabId) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTabId(tabId);
        setIsTransitioning(false);
      }, 150);
    }
  };

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
            <button className="bg-white border border-gray-200 h-[42px] px-5 py-2.5 rounded-lg font-medium text-sm text-gray-900 hover:bg-gray-50 active:scale-95 flex items-center gap-2 transition-all duration-200 cursor-pointer">
              <HeartIcon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110"/>
              Add to favourites
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
        <div className="max-w-[1240px] w-full">
          <TabNavigation
            tabs={course.tabs}
            activeTabId={activeTabId}
            onTabClick={handleTabClick}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white flex justify-center px-[100px] py-[60px]">
        <div className="flex flex-col gap-[60px] max-w-[1240px] w-full">
          {/* Tab Content - Dynamic Sections */}
          <div className={`flex flex-col gap-4 transition-all duration-300 ${
            isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}>
            {activeTab.content.map((section, index) => (
              <>
                {renderContentSection(section, index)}
                {index < activeTab.content.length - 1 && (
                  <div key={`divider-${index}`} className="h-px bg-gray-200 w-full" />
                )}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
