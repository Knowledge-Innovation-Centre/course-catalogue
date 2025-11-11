export interface Course {
  id: string;
  title: string;
  university: string;
  imageUrl: string;
  ects: number;
  eqfLevel: number;
  deliveryMode: 'Online' | 'In person' | 'Blended';
  language: string;
}

export interface Filters {
  categories: string[];
  deliveryModes: string[];
  assessmentTypes: string[];
  priceRange: [number, number];
  experienceLevel: [number, number];
  workload: [number, number];
  language: string;
  location: string;
}

// Course detail page types
export interface InfoCard {
  label: string;
  value: string;
  hasTooltip?: boolean;
}

export interface Skill {
  name: string;
  escoLink?: string;
}

export interface QualityIndicatorField {
  label: string;
  subtitle?: string;
  hasTooltip?: boolean;
  value: string | string[];
  linkText?: string;
  linkUrl?: string;
}

export interface QualityIndicatorSection {
  title: string;
  fields: QualityIndicatorField[];
}

export interface ContentSection {
  type: 'text' | 'list' | 'provider' | 'skills' | 'link' | 'quality-indicators' | 'info-cards';
  label: string;
  hasTooltip?: boolean;
  data: string | string[] | Skill[] | { name: string; link: string } | { text: string; linkText: string; linkUrl: string } | QualityIndicatorSection[] | InfoCard[];
}

export interface CourseTab {
  id: string;
  label: string;
  active: boolean;
  content: ContentSection[];
}

export interface CourseDetail {
  id: string;
  title: string;
  university: string;
  universityLink: string;
  heroImageUrl: string;
  tabs: CourseTab[];
}
