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

// Tab contains Sections
export interface CourseTab {
  id: string;
  label: string;
  content: Section[];  // Array of sections
}

// Section contains Fields and optional title
export interface Section {
  title?: string;  // Optional section title (displayed as header if defined)
  fields: Field[]; // Array of fields
}

// Field types
export type Field =
  | InfoCardField
  | TextField
  | ListField
  | ProviderField
  | SkillsField
  | LinkField;

export interface InfoCardField {
  type: 'info-card';
  label: string;
  value: string;
  tooltip?: string;
}

export interface TextField {
  type: 'text';
  label: string;
  tooltip?: string;
  value: string;
}

export interface ListField {
  type: 'list';
  label: string;
  tooltip?: string;
  items: string[];
}

export interface ProviderField {
  type: 'provider';
  label: string;
  tooltip?: string;
  name: string;
  link: string;
}

export interface SkillsField {
  type: 'skills';
  label: string;
  tooltip?: string;
  name: string;
  escoLink?: string;
}

export interface LinkField {
  type: 'link';
  label: string;
  tooltip?: string;
  subtitle?: string;  // Optional subtitle
  value: string | string[];  // Can be single value or array
  linkText?: string;  // Optional link
  linkUrl?: string;
}

export interface CourseDetail {
  id: string;
  title: string;
  university: string;
  universityLink: string;
  heroImageUrl: string;
  tabs: CourseTab[];
}
