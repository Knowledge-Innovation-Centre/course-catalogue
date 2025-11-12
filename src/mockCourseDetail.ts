import type { CourseDetail } from './types';

export const mockCourseDetail: CourseDetail = {
  id: '1',
  title: 'Honey Bee Health (Apiculture)',
  university: 'University of Galway',
  universityLink: 'https://www.universityofgalway.ie',
  heroImageUrl: 'http://localhost:3845/assets/fe19c44181781b3dd05f6de970027f0b7a0c0d1e.png',

  tabs: [
    {
      id: 'basic-data',
      label: 'Basic data',
      content: [
        // Section 1 - Info Cards (no title)
        {
          fields: [
            { type: 'info-card', label: 'DELIVERY MODE', value: 'Blended', tooltip: 'Additional information about this field' },
            { type: 'info-card', label: 'COUNTRY', value: 'Ireland' },
            { type: 'info-card', label: 'LANGUAGE', value: 'English' },
            { type: 'info-card', label: 'PRICE', value: '500 EUR' },
            { type: 'info-card', label: 'WORKLOAD', value: '5 ECTS', tooltip: 'Additional information about this field' },
            { type: 'info-card', label: 'LEVEL', value: 'EQF 6', tooltip: 'Additional information about this field' },
          ],
        },
        // Section 2 - Other Fields (no title)
        {
          fields: [
            { type: 'text', label: 'DESCRIPTION', value: 'This module will introduce you to the factors impacting honeybee health. This includes bee-related factors that regulate honeybee health such as social immunity, influence of microbiome and plant-bee interactions. It will then introduce you to the factors that negatively affect bee health including diseases, pathogens and poisons, habitat decline, and other human influences.' },
            { type: 'provider', label: 'PROVIDER', tooltip: 'Additional information about this field', name: 'University of Galway', link: 'https://www.universityofgalway.ie' },
            {
              type: 'list',
              label: 'LEARNING OUTCOMES',
              tooltip: 'Additional information about this field',
              items: [
                'Discuss the mechanisms of immunity in Apis mellifera',
                'Identify current parasites of honeybees in Ireland and more widely, considering potential threats to honeybee health from imported bees and other products',
                'Describe the life cycle of the mAin honeybee pathogens',
                'explain the importance of plants to honeybee health',
                'Link the diversity of microbes associated with honeybees with their influence on honeybee health',
                'Discuss human-mediated factors involved in decline of honeybee health.',
              ]
            },
            { type: 'skills', label: 'SKILLS', tooltip: 'Additional information about this field', name: 'Handle honeycombs', escoLink: 'https://esco.ec.europa.eu/' },
            { type: 'skills', label: 'SKILLS', name: 'Diferentiate honeydepending on the origin', escoLink: 'https://esco.ec.europa.eu/' },
            { type: 'text', label: 'TYPE OF ASSESSMENT', tooltip: 'Additional information about this field', value: 'Continuous assessment' },
            { type: 'text', label: 'SUPERVISION AND IDENTITY VERIFICATION', tooltip: 'Additional information about this field', value: 'Supervised online' },
            { type: 'text', label: 'FORM OF PARTICIPATION', tooltip: 'Additional information about this field', value: 'Blended (online & on site)' },
            { type: 'text', label: 'PREREQUISITES', tooltip: 'Additional information about this field', value: 'Minimum age: 21 years' },
            { type: 'text', label: 'TYPE OF CREDENTIAL AWARDED', tooltip: 'Additional information about this field', value: 'EDC; paper-based' },
            { type: 'text', label: 'IDENTIFIER', tooltip: 'Additional information about this field', value: 'IE0003::ZO1202' },
          ],
        },
      ],
    },
    {
      id: 'external-qa',
      label: 'External quality assurance',
      content: [
        // Section 1 - QA Info (no title)
        {
          fields: [
            {
              type: 'link',
              label: 'EUROPEAN: QUALITY ASSURANCE IN LINE WITH ESG',
              tooltip: 'Additional information about this field',
              value: 'Institutional audit, by QQI, 2023',
              linkText: 'Learn more',
              linkUrl: 'https://www.qqi.ie/',
            },
            {
              type: 'text',
              label: 'NATIONAL: FORMAL QUALITY ASSURANCE',
              tooltip: 'Additional information about this field',
              value: 'N/A',
            },
          ],
        },
      ],
    },
    {
      id: 'quality-indicators',
      label: 'Quality indicators',
      content: [
        // Section 1 - WITH TITLE
        {
          title: 'Content relevance, labour market demand and accuracy',
          fields: [
            {
              type: 'link',
              label: 'ACCURATE AND UP-TO-DATE INFORMATION',
              subtitle: 'Learning outcomes in ESCO ontology',
              tooltip: 'Additional information about this field',
              value: 'No (ESCO skills generated)',
            },
            {
              type: 'link',
              label: 'DEMAND FOR SKILLS',
              subtitle: 'Skills provided mentioned in up to X% of job ads',
              tooltip: 'Additional information about this field',
              value: ['45%', '• handle honeycombs: 23%', '• diferentiate honey depending on the origin: 31%'],
            },
            {
              type: 'link',
              label: 'DEMAND FOR SKILLS',
              subtitle: 'Skills provided relevant to X% of occupations covered in job ads',
              tooltip: 'Additional information about this field',
              value: '78%',
            },
            {
              type: 'link',
              label: 'STACKABILITY',
              subtitle: 'Number of known further learning pathways, e.g. possibility to stack MC to a degree or larger credential',
              tooltip: 'Additional information about this field',
              value: '12 pathways offered by 9 different providers',
              linkText: 'Learn more',
              linkUrl: '#',
            },
            {
              type: 'link',
              label: 'QUALITY LABELS',
              tooltip: 'Additional information about this field',
              value: 'EUR-ACE, AACSB',
            },
          ],
        },
        // Section 2 - WITH TITLE
        {
          title: 'Teaching methods and pedagogy',
          fields: [
            {
              type: 'link',
              label: 'PLATFORM QA',
              subtitle: 'Micro-credential with quality-assured presence on platform',
              tooltip: 'Additional information about this field',
              value: 'Coursera, EdX',
            },
            {
              type: 'link',
              label: 'STUDENT / STAFF RATIO',
              subtitle: 'Students per academic (FTE)',
              tooltip: 'Additional information about this field',
              value: '56',
            },
            {
              type: 'link',
              label: 'ACTIVE METHODOLOGIES EMPLOYED IN THE COURSE',
              tooltip: 'Additional information about this field',
              value: 'None',
            },
            {
              type: 'link',
              label: 'AVAILABILITY OF TUTORING OR MENTORING',
              tooltip: 'Additional information about this field',
              value: 'Yes',
              linkText: 'Learn more',
              linkUrl: '#',
            },
            {
              type: 'link',
              label: 'VIRTUAL LEARNING ENVIRONMENT (VLE) AND LEARNING MANAGEMENT SYSTEM (LMS)',
              tooltip: 'Additional information about this field',
              value: 'Moodle',
            },
          ],
        },
        // Section 3 - WITH TITLE
        {
          title: 'Accessibility and inclusivity',
          fields: [
            {
              type: 'link',
              label: 'MAKE-UP OF THE STUDENT BODY',
              subtitle: 'Mature students',
              tooltip: 'Additional information about this field',
              value: '12%',
            },
            {
              type: 'link',
              label: 'MAKE-UP OF THE STUDENT BODY',
              subtitle: 'Students from disadvantaged backgrounds',
              tooltip: 'Additional information about this field',
              value: '17%',
            },
            {
              type: 'link',
              label: 'RECOGNITION OF PRIOR LEARNING',
              tooltip: 'Additional information about this field',
              value: 'Yes',
              linkText: 'Learn more',
              linkUrl: '#',
            },
            {
              type: 'link',
              label: 'GRANTS / LOANS',
              tooltip: 'Additional information about this field',
              value: 'BAföG',
              linkText: 'Learn more',
              linkUrl: '#',
            },
          ],
        },
        // Section 4 - WITH TITLE
        {
          title: 'Learner-centred approach, satisfaction and success',
          fields: [
            {
              type: 'link',
              label: 'STUDENT RATINGS',
              subtitle: 'Percentage of learners recommending this micro-credential',
              tooltip: 'Additional information about this field',
              value: '87%',
            },
            {
              type: 'link',
              label: 'STUDENT SATISFACTION',
              subtitle: 'Rating established by internal QA',
              tooltip: 'Additional information about this field',
              value: '4.1 / 5',
            },
            {
              type: 'link',
              label: 'STUDENT RATING (OVERALL)',
              tooltip: 'Additional information about this field',
              value: '3.8 / 5',
            },
            {
              type: 'link',
              label: 'STUDENT RATING ("WOULD TAKE AGAIN")',
              tooltip: 'Additional information about this field',
              value: '18%',
            },
            {
              type: 'link',
              label: 'STUDENT RATING (AVERAGE LEVEL OF DIFFICULTY)',
              tooltip: 'Additional information about this field',
              value: '3.5',
            },
            {
              type: 'link',
              label: 'GRADUATION RATE',
              tooltip: 'Additional information about this field',
              value: '83%',
            },
            {
              type: 'link',
              label: 'GRADUATE SUCCESS',
              subtitle: 'Percentage who upgrade their career within 1 year of completing',
              tooltip: 'Additional information about this field',
              value: '65%',
            },
            {
              type: 'link',
              label: 'GRADE DISTRIBUTION',
              tooltip: 'Additional information about this field',
              value: ['A+: 12%', 'A: 31%', 'B: 32%', 'C: 4%', 'Fail: 11%'],
            },
          ],
        },
        // Section 5 - WITH TITLE
        {
          title: 'Institutional reputation',
          fields: [
            {
              type: 'link',
              label: 'EXPERTISE OF LECTURERS',
              subtitle: 'Average score/number of scientific publications',
              tooltip: 'Additional information about this field',
              value: 'N/A',
            },
            {
              type: 'link',
              label: 'RANKING',
              subtitle: 'Rank of education provider',
              tooltip: 'Additional information about this field',
              value: '789',
            },
            {
              type: 'link',
              label: 'MEMBERSHIPS',
              tooltip: 'Additional information about this field',
              value: 'IEEE',
            },
            {
              type: 'link',
              label: 'RECOGNITION HISTORY',
              subtitle: 'HEIs that recognised this microcredential in their degree programmes',
              tooltip: 'Additional information about this field',
              value: '21',
            },
            {
              type: 'link',
              label: 'SKILLS RECOGNITION',
              subtitle: 'HEIs that value the skills learned in this micro-credential',
              tooltip: 'Additional information about this field',
              value: '53',
            },
          ],
        },
      ],
    },
  ],
};
