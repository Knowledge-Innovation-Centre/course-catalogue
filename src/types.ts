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
  icon: string; // Icon component name or SVG path
  label: string;
  value: string;
  hasTooltip?: boolean;
}

export interface Skill {
  name: string;
  escoLink?: string;
}

export interface CourseTab {
  id: string;
  label: string;
  active: boolean;
}

export interface CourseDetail {
  id: string;
  title: string;
  university: string;
  universityLink: string;
  heroImageUrl: string;
  tabs: CourseTab[];

  // Info cards (first 6 key details shown as cards)
  infoCards: InfoCard[];

  // Detailed information sections
  description: string;
  provider: {
    name: string;
    link: string;
  };
  learningOutcomes: string[];
  skills: Skill[];
  typeOfAssessment: string;
  supervisionAndIdentityVerification: string;
  formOfParticipation: string;
  prerequisites: string;
  typeOfCredentialAwarded: string;
  identifier: string;
}
