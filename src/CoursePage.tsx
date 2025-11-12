import { useState } from "react";
import type { CourseDetail, Section, Field } from "./types";
import { TabNavigation } from "./components/TabNavigation";
import { InfoCard } from "./components/InfoCard";
import { Tooltip } from "./components/Tooltip";
import { theme } from "./theme";
import { HeartIcon, ExternalLink } from "lucide-react";

interface CoursePageProps {
  course: CourseDetail;
}

function renderField(field: Field, fieldIndex: number) {
  // Helper to render label for fields that have it
  const renderLabel = (label: string, tooltip?: string, subtitle?: string) => (
    <div className="flex flex-col gap-1 w-full lg:w-[310px] shrink-0 self-start mb-2 lg:mb-0">
      <span className="font-semibold text-sm sm:text-base text-gray-500 tracking-wider uppercase">
        {label}
        {tooltip && (
          <Tooltip text={tooltip} className="inline-block ml-2 align-middle mb-1" />
        )}
      </span>
      {subtitle && <p className="font-medium text-xs sm:text-sm text-gray-500 tracking-[0.56px]">{subtitle}</p>}
    </div>
  );

  switch (field.type) {
    case "info-card":
      return <InfoCard key={fieldIndex} card={field} />;

    case "text":
      return (
        <div key={fieldIndex} className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start lg:items-center">
          {renderLabel(field.label, field.tooltip)}
          <p className="font-medium text-sm sm:text-base text-gray-900 leading-[1.5] flex-1">{field.value}</p>
        </div>
      );

    case "list":
      return (
        <div key={fieldIndex} className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {renderLabel(field.label, field.tooltip)}
          <ul className="flex-1 font-medium text-sm sm:text-base text-gray-900 leading-[1.5] list-disc ml-5">
            {field.items.map((item, i) => (
              <li key={i} className="mb-1">
                {item}
              </li>
            ))}
          </ul>
        </div>
      );

    case "provider":
      return (
        <div key={fieldIndex} className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start lg:items-center">
          {renderLabel(field.label, field.tooltip)}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 flex-1">
            <span className="font-medium text-sm sm:text-base text-gray-900">{field.name}</span>
            <a
              href={field.link}
              className="flex items-center gap-1 font-medium text-sm sm:text-base underline hover:opacity-80 transition-opacity"
              style={{ color: theme.colors.link }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 15L15 5M15 5H9M15 5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      );

    case "skills":
      return (
        <div key={fieldIndex} className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start lg:items-center">
          {renderLabel(field.label, field.tooltip)}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 flex-1">
            <span className="font-medium text-sm sm:text-base text-gray-900 list-disc flex items-center before:content-['•'] before:mr-2">{field.name}</span>
            {field.escoLink && (
              <a
                href={field.escoLink}
                className="flex items-center gap-1 font-medium text-sm sm:text-base underline hover:opacity-80 transition-opacity"
                style={{ color: theme.colors.link }}
                target="_blank"
                rel="noopener noreferrer"
              >
                ESCO
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 15L15 5M15 5H9M15 5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
          </div>
        </div>
      );

    case "link":
      return (
        <div key={fieldIndex} className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start">
          {renderLabel(field.label, field.tooltip, field.subtitle)}
          <div className="flex-1 flex flex-wrap items-start gap-3 sm:gap-4">
            {Array.isArray(field.value) ? (
              <div className="font-medium text-sm sm:text-base text-gray-900 leading-[1.5]">
                {field.value.map((item, itemIdx) => (
                  <p key={itemIdx} className="mb-0">
                    {item}
                  </p>
                ))}
              </div>
            ) : (
              <span className="font-medium text-sm sm:text-base text-gray-900 leading-[1.5]">{field.value}</span>
            )}
            {field.linkText && field.linkUrl && (
              <a
                href={field.linkUrl}
                className="flex items-center gap-1 font-medium text-sm sm:text-base underline hover:opacity-80 transition-opacity whitespace-nowrap"
                style={{ color: theme.colors.link }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {field.linkText}
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      );

    default:
      return null;
  }
}

function renderSection(section: Section, sectionIndex: number) {
  // Check if all fields are info-cards
  const allInfoCards = section.fields.every(field => field.type === 'info-card');

  if (allInfoCards) {
    // Render info cards in a grid
    return (
      <div key={sectionIndex} className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
        {section.title && <h2 className="font-semibold text-lg sm:text-xl text-gray-900">{section.title}</h2>}
        <div className="flex flex-wrap gap-4 pb-10">
          {section.fields.map((field, fieldIdx) => renderField(field, fieldIdx))}
        </div>
      </div>
    );
  }

  // Regular section with fields
  return (
    <div key={sectionIndex} className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
      {section.title && <h2 className="font-semibold text-lg sm:text-xl text-gray-900">{section.title}</h2>}
      <div className="flex flex-col gap-4">
        {section.fields.map((field, fieldIdx) => (
          <>
            {renderField(field, fieldIdx)}
            {fieldIdx < section.fields.length - 1 && <div key={`divider-${fieldIdx}`} className="h-px bg-gray-200 w-full" />}
          </>
        ))}
      </div>
    </div>
  );
}

export function CoursePage({ course }: CoursePageProps) {
  const [activeTabId, setActiveTabId] = useState(course.tabs[0].id);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const activeTab = course.tabs.find((tab) => tab.id === activeTabId) || course.tabs[0];

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
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="bg-white w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center h-[78px] px-4 sm:px-8 lg:px-[100px]" style={{ backgroundColor: theme.colors.primary }}>
        <div className="flex gap-3 items-center max-w-[1240px] w-full">
          <div className="h-9 w-[37px] relative shrink-0">
            <img alt={theme.logo.name} className="h-full w-full object-contain" src={theme.logo.url} />
          </div>
          <p className="flex-1 font-semibold text-lg sm:text-xl text-white">{theme.logo.name}</p>
        </div>
      </div>

      {/* Hero Image */}
      <div className="bg-gray-50 w-full h-[140px] sm:h-[180px] lg:h-[219px] relative overflow-hidden">
        <img alt={course.title} className="w-full h-full object-cover" src={course.heroImageUrl} />
      </div>

      {/* Title Section */}
      <div className="bg-gray-50 flex justify-center px-4 sm:px-8 lg:px-[100px] py-8 sm:py-12 lg:py-[60px]">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start max-w-[1240px] w-full">
          <div className="flex-1 flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="font-semibold text-xl sm:text-2xl text-gray-900 leading-[1.5]">{course.title}</h1>
              <div className="flex gap-1.5 items-center text-sm sm:text-base">
                <span className="font-normal text-gray-900">by</span>
                <a href={course.universityLink} className="font-semibold underline hover:opacity-80 transition-opacity" style={{ color: theme.colors.link }} target="_blank" rel="noopener noreferrer">
                  {course.university}
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={handleFavoriteClick}
              className={`h-[42px] px-5 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 border transition-all duration-500 cursor-pointer active:scale-95 ${
                isFavorited
                  ? 'bg-white text-red-500 border-red-500 hover:bg-red-50'
                  : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <HeartIcon
                className={`w-4 h-4 transition-all duration-500 ${isFavorited ? 'scale-110 fill-red-500 text-red-500' : ''}`}
              />
              {isFavorited ? 'Favorited' : 'Add to favourites'}
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
          <TabNavigation tabs={course.tabs} activeTabId={activeTabId} onTabClick={handleTabClick} />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white flex justify-center px-4 sm:px-8 lg:px-[100px] py-8 sm:py-12 lg:py-[60px]">
        <div className="flex flex-col gap-10 sm:gap-12 lg:gap-[60px] max-w-[1240px] w-full">
          {/* Tab Content - Dynamic Sections */}
          <div className={`flex flex-col gap-10 sm:gap-12 lg:gap-[60px] transition-all duration-300 ${isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
            {activeTab.content.map((section, index) => renderSection(section, index))}
          </div>
        </div>
      </div>
    </div>
  );
}
