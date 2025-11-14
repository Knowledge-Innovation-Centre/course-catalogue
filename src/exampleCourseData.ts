import type { CourseData } from './courseDataTypes';

/**
 * Example Course Data (VALUES ONLY)
 *
 * This is what GET /courses/:id should return.
 * Notice: NO labels, NO tooltips, NO field types - just pure data values.
 *
 * The structure (which tabs exist, field labels, tooltips, icons, etc.)
 * comes from the AppConfig loaded at app initialization.
 */
export const exampleCourseData: CourseData = {
  // Basic course information
  id: '1',
  title: 'Honey Bee Health (Apiculture)',
  university: 'University of Galway',
  universityLink: 'https://www.universityofgalway.ie',
  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png',

  // Data values only - structure comes from config
  data: {
    // Basic data tab
    deliveryMode: 'Blended',
    country: 'Ireland',
    language: 'English',
    price: 500,
    currency: 'EUR',
    ects: 5,
    eqfLevel: 6,
    description: 'This module will introduce you to the factors impacting honeybee health. This includes bee-related factors that regulate honeybee health such as social immunity, influence of microbiome and plant-bee interactions. It will then introduce you to the factors that negatively affect bee health including diseases, pathogens and poisons, habitat decline, and other human influences.',
    provider: {
      name: 'University of Galway',
      link: 'https://www.universityofgalway.ie'
    },
    learningOutcomes: [
      'Discuss the mechanisms of immunity in Apis mellifera',
      'Identify current parasites of honeybees in Ireland and more widely, considering potential threats to honeybee health from imported bees and other products',
      'Describe the life cycle of the main honeybee pathogens',
      'Explain the importance of plants to honeybee health',
      'Link the diversity of microbes associated with honeybees with their influence on honeybee health',
      'Discuss human-mediated factors involved in decline of honeybee health.'
    ],
    skills: [
      {
        name: 'Handle honeycombs',
        escoLink: 'https://esco.ec.europa.eu/en/classification/skill_main'
      },
      {
        name: 'Differentiate honey depending on the origin',
        escoLink: 'https://esco.ec.europa.eu/en/classification/skill_main'
      }
    ],
    assessmentType: 'Continuous assessment',
    supervisionIdentityVerification: 'Supervised online',
    formOfParticipation: 'Blended (online & on site)',
    prerequisites: 'Minimum age: 21 years',
    credentialType: 'EDC; paper-based',
    identifier: 'IE0003::ZO1202',

    // External QA tab
    europeanQA: 'Institutional audit, by QQI, 2023',
    europeanQALink: 'https://www.qqi.ie/',
    nationalQA: 'N/A',

    // Quality indicators tab
    accurateInfo: 'No (ESCO skills generated)',
    skillsDemand: [
      '45%',
      '• handle honeycombs: 23%',
      '• differentiate honey depending on the origin: 31%'
    ],
    stackability: '12 pathways offered by 9 different providers',
    stackabilityLink: '#',
    qualityLabels: 'EUR-ACE, AACSB',
    platformQA: 'Coursera, EdX',
    studentStaffRatio: 56,
    activeMethods: 'None',
    tutoringAvailability: 'Yes',
    tutoringLink: '#',
    vle: 'Moodle',
    studentBodyMature: '12%',
    studentBodyDisadvantaged: '17%',
    priorLearningRecognition: 'Yes',
    priorLearningLink: '#',
    grants: 'BAföG',
    grantsLink: '#',
    studentRatings: '87%',
    studentSatisfaction: '4.1 / 5',
    studentRatingOverall: '3.8 / 5',
    studentRatingWouldTakeAgain: '18%',
    studentRatingDifficulty: '3.5',
    graduationRate: '83%',
    graduateSuccess: '65%',
    gradeDistribution: ['A+: 12%', 'A: 31%', 'B: 32%', 'C: 4%', 'Fail: 11%'],
    lecturerExpertise: 'N/A',
    institutionRanking: 789,
    memberships: 'IEEE',
    recognitionHistory: 21,
    skillsRecognition: 53,
  }
};

/**
 * COMPARISON: Old vs New Approach
 *
 * OLD APPROACH (Current):
 * -----------------------
 * GET /courses/1 returns:
 * {
 *   "id": "1",
 *   "title": "Course Title",
 *   "tabs": [
 *     {
 *       "id": "basic-data",
 *       "label": "Basic data",  // ❌ Structure sent with every course
 *       "content": [
 *         {
 *           "fields": [
 *             {
 *               "type": "info-card",        // ❌ Structure
 *               "label": "DELIVERY MODE",   // ❌ Structure
 *               "tooltip": "...",           // ❌ Structure
 *               "value": "Blended"          // ✅ Data
 *             }
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 * }
 *
 * NEW APPROACH (Efficient):
 * -------------------------
 * 1. GET /config (called ONCE on app load) returns:
 * {
 *   "courseDetail": {
 *     "tabs": [
 *       {
 *         "id": "basic-data",
 *         "label": "Basic data",  // ✅ Structure loaded once
 *         "sections": [
 *           {
 *             "fields": [
 *               {
 *                 "key": "deliveryMode",         // Maps to data key
 *                 "type": "info-card",           // ✅ Structure
 *                 "label": "DELIVERY MODE",      // ✅ Structure
 *                 "tooltip": "...",              // ✅ Structure
 *                 "format": "{value}"            // ✅ Structure
 *               }
 *             ]
 *           }
 *         ]
 *       }
 *     ]
 *   }
 * }
 *
 * 2. GET /courses/1 (called per course) returns:
 * {
 *   "id": "1",
 *   "title": "Course Title",
 *   "data": {
 *     "deliveryMode": "Blended"  // ✅ Only data values
 *   }
 * }
 *
 * BENEFITS:
 * ---------
 * ✅ Structure loaded once, not repeated for every course
 * ✅ Smaller API responses for course data
 * ✅ Can change labels/structure without re-deploying data
 * ✅ Consistent structure across all courses per provider
 * ✅ Easier to maintain and update field definitions
 */
