// Course Data Types - Values Only (No Structure)
// These types represent the actual course data returned from GET /courses/:id
// The structure (labels, field types, tooltips) comes from the AppConfig

/**
 * Course data containing ONLY values, no structure
 * The keys correspond to the "key" fields defined in the AppConfig
 */
export interface CourseData {
  // Basic course info
  id: string;
  title: string;
  university: string;
  universityLink: string;
  imageUrl: string;

  // Data values - the structure/labels come from config
  data: {
    // Basic data tab fields
    deliveryMode?: string;
    country?: string;
    language?: string;
    price?: number | string;
    currency?: string;
    ects?: number;
    eqfLevel?: number;
    description?: string;
    provider?: {
      name: string;
      link: string;
    };
    learningOutcomes?: string[];
    skills?: Array<{
      name: string;
      escoLink?: string;
    }>;
    assessmentType?: string;
    supervisionIdentityVerification?: string;
    formOfParticipation?: string;
    prerequisites?: string;
    credentialType?: string;
    identifier?: string;

    // External QA tab fields
    europeanQA?: string;
    europeanQALink?: string;
    nationalQA?: string;

    // Quality indicators tab fields
    accurateInfo?: string;
    accurateInfoLink?: string;
    skillsDemand?: string[] | string;
    skillsDemandLink?: string;
    stackability?: string;
    stackabilityLink?: string;
    qualityLabels?: string;
    platformQA?: string;
    studentStaffRatio?: string | number;
    activeMethods?: string;
    tutoringAvailability?: string;
    tutoringLink?: string;
    vle?: string;
    studentBodyMature?: string;
    studentBodyDisadvantaged?: string;
    priorLearningRecognition?: string;
    priorLearningLink?: string;
    grants?: string;
    grantsLink?: string;
    studentRatings?: string;
    studentSatisfaction?: string;
    studentRatingOverall?: string;
    studentRatingWouldTakeAgain?: string;
    studentRatingDifficulty?: string;
    graduationRate?: string;
    graduateSuccess?: string;
    gradeDistribution?: string[];
    lecturerExpertise?: string;
    institutionRanking?: string | number;
    memberships?: string;
    recognitionHistory?: string | number;
    skillsRecognition?: string | number;

    // Allow additional custom fields
    [key: string]: any;
  };
}

/**
 * Course list item for GET /courses
 * Contains ONLY values - structure comes from config.courseCard
 */
export interface CourseListItem {
  id: string;
  title: string;
  university: string;
  imageUrl: string;

  // All other fields are dynamic based on config.courseCard.fields
  // The keys match the "key" property in field config
  [key: string]: any;
}

/**
 * Response from GET /courses
 */
export interface CourseListResponse {
  data: CourseListItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

/**
 * Helper type for rendering fields dynamically
 * Combines config field definition with actual data value
 */
export interface FieldWithData {
  config: any; // Field config from AppConfig
  value: any;  // Actual data value
}
