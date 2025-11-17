import type { AppConfig } from './configTypes';


export const exampleConfig: AppConfig = {
  // ===== FILTERS CONFIGURATION =====
  filters: {
    categories: {
      type: 'multiselect',
      label: 'Categories',
      icon: 'folder',
      enabled: true,
      options: [
        { value: 'agriculture', label: 'Agriculture' },
        { value: 'business', label: 'Business' },
        { value: 'technology', label: 'Technology' },
        { value: 'health', label: 'Health Sciences' },
        { value: 'arts', label: 'Arts & Humanities' },
      ],
    },
    deliveryMode: {
      type: 'multiselect',
      label: 'Delivery Mode',
      icon: 'monitor',
      enabled: true,
      options: [
        { value: 'online', label: 'Online' },
        { value: 'in-person', label: 'In person' },
        { value: 'blended', label: 'Blended' },
      ],
    },
    assessmentType: {
      type: 'multiselect',
      label: 'Assessment Type',
      icon: 'clipboard-check',
      enabled: true,
      options: [
        { value: 'continuous', label: 'Continuous Assessment' },
        { value: 'exam', label: 'Final Exam' },
        { value: 'project', label: 'Project-Based' },
        { value: 'mixed', label: 'Mixed' },
      ],
    },
    price: {
      type: 'range',
      label: 'Price',
      icon: 'euro',
      enabled: true,
      min: 0,
      max: 5000,
      step: 100,
      unit: 'EUR',
      format: '{value} {unit}',
    },
    ects: {
      type: 'range',
      label: 'Workload (ECTS)',
      icon: 'clock',
      enabled: true,
      min: 1,
      max: 60,
      step: 1,
      unit: 'ECTS',
      format: '{value} {unit}',
    },
    eqfLevel: {
      type: 'range',
      label: 'Experience Level',
      icon: 'graduation-cap',
      enabled: true,
      min: 1,
      max: 8,
      step: 1,
      unit: 'EQF',
      format: 'EQF {value}',
    },
    language: {
      type: 'select',
      label: 'Language',
      icon: 'globe',
      enabled: true,
      options: [
        { value: 'all', label: 'All Languages' },
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
        { value: 'fr', label: 'French' },
        { value: 'de', label: 'German' },
        { value: 'it', label: 'Italian' },
      ],
    },
    location: {
      type: 'text',
      label: 'Location',
      icon: 'map-pin',
      enabled: true,
      placeholder: 'Enter city or country...',
    },
  },

  // ===== COURSE CARD CONFIGURATION =====
  courseCard: {
    image: {
      enabled: true,
      aspectRatio: '16:9',
      placeholder: '/assets/images/placeholder-course.jpg',
    },
    fields: [
      {
        key: 'title',
        type: 'text',
        label: null,
        position: 'header',
        format: '{value}',
        className: 'text-xl font-semibold text-gray-900',
      },
      {
        key: 'university',
        type: 'text',
        label: null,
        position: 'subheader',
        format: '{value}',
        className: 'text-sm text-gray-600',
      },
      {
        key: 'ects',
        type: 'badge',
        label: 'ECTS',
        position: 'badges',
        icon: 'clock',
        format: '{value} ECTS',
        className: 'bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded',
      },
      {
        key: 'eqfLevel',
        type: 'badge',
        label: 'Level',
        position: 'badges',
        icon: 'graduation-cap',
        format: 'EQF {value}',
        className: 'bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded',
      },
      {
        key: 'deliveryMode',
        type: 'badge',
        label: 'Delivery',
        position: 'badges',
        icon: 'monitor',
        format: '{value}',
        className: 'bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded',
        iconMap: {
          Online: 'monitor',
          'In person': 'users',
          Blended: 'monitor-smartphone',
        },
      },
      {
        key: 'language',
        type: 'badge',
        label: 'Language',
        position: 'badges',
        icon: 'globe',
        format: '{value}',
        className: 'bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded',
      },
    ],
  },

  // ===== COURSE DETAIL CONFIGURATION =====
  courseDetail: {
    tabs: [
      {
        id: 'basic-data',
        label: 'Basic data',
        enabled: true,
        sections: [
          {
            id: 'info-cards',
            title: null,
            layout: 'grid',
            fields: [
              {
                key: 'deliveryMode',
                type: 'info-card',
                label: 'DELIVERY MODE',
                icon: 'monitor',
                tooltip: 'How the course is delivered',
                format: '{value}',
              },
              {
                key: 'country',
                type: 'info-card',
                label: 'COUNTRY',
                icon: 'map-pin',
                tooltip: 'Location where the course is offered',
                format: '{value}',
              },
              {
                key: 'language',
                type: 'info-card',
                label: 'LANGUAGE',
                icon: 'globe',
                tooltip: 'Primary language of instruction',
                format: '{value}',
              },
              {
                key: 'price',
                type: 'info-card',
                label: 'PRICE',
                icon: 'euro',
                tooltip: 'Course fee',
                format: '{value}',
              },
              {
                key: 'ects',
                type: 'info-card',
                label: 'WORKLOAD',
                icon: 'clock',
                tooltip: 'European Credit Transfer System credits',
                format: '{value} ECTS',
              },
              {
                key: 'eqfLevel',
                type: 'info-card',
                label: 'LEVEL',
                icon: 'graduation-cap',
                tooltip: 'European Qualifications Framework level',
                format: 'EQF {value}',
              },
            ],
          },
          {
            id: 'main-info',
            title: null,
            layout: 'list',
            fields: [
              {
                key: 'description',
                type: 'text',
                label: 'DESCRIPTION',
                tooltip: 'Course overview and objectives',
                format: '{value}',
              },
              {
                key: 'provider',
                type: 'provider',
                label: 'PROVIDER',
                tooltip: 'Institution offering this course',
                format: {
                  name: '{name}',
                  link: '{link}',
                },
              },
              {
                key: 'learningOutcomes',
                type: 'list',
                label: 'LEARNING OUTCOMES',
                tooltip: 'Skills and knowledge you will gain',
                format: 'bullet',
                icon: 'check-circle',
              },
              {
                key: 'skills',
                type: 'skills',
                label: 'SKILLS',
                tooltip: 'Specific skills taught in this course',
                showEscoLink: true,
                icon: 'award',
              },
              {
                key: 'assessmentType',
                type: 'text',
                label: 'TYPE OF ASSESSMENT',
                tooltip: 'How you will be evaluated',
                format: '{value}',
              },
              {
                key: 'prerequisites',
                type: 'text',
                label: 'PREREQUISITES',
                tooltip: 'Requirements to enroll',
                format: '{value}',
              },
            ],
          },
        ],
      },
      {
        id: 'external-qa',
        label: 'External quality assurance',
        enabled: true,
        sections: [
          {
            id: 'qa-info',
            title: null,
            layout: 'list',
            fields: [
              {
                key: 'europeanQA',
                type: 'link',
                label: 'EUROPEAN: QUALITY ASSURANCE IN LINE WITH ESG',
                tooltip: 'European Standards and Guidelines compliance',
                format: '{value}',
                linkConfig: {
                  text: 'Learn more',
                  url: '{linkUrl}',
                },
              },
              {
                key: 'nationalQA',
                type: 'text',
                label: 'NATIONAL: FORMAL QUALITY ASSURANCE',
                tooltip: 'National quality assurance frameworks',
                format: '{value}',
              },
            ],
          },
        ],
      },
      {
        id: 'quality-indicators',
        label: 'Quality indicators',
        enabled: true,
        sections: [
          {
            id: 'content-relevance',
            title: 'Content relevance, labour market demand and accuracy',
            layout: 'list',
            fields: [
              {
                key: 'accurateInfo',
                type: 'link',
                label: 'ACCURATE AND UP-TO-DATE INFORMATION',
                subtitle: 'Learning outcomes in ESCO ontology',
                tooltip: 'Data validation details',
                format: '{value}',
              },
              {
                key: 'skillsDemand',
                type: 'link',
                label: 'DEMAND FOR SKILLS',
                subtitle: 'Skills provided mentioned in job ads',
                tooltip: 'Labour market demand statistics',
                format: 'multiline',
              },
              {
                key: 'stackability',
                type: 'link',
                label: 'STACKABILITY',
                subtitle: 'Further learning pathways',
                tooltip: 'Possibilities to stack credentials',
                format: '{value}',
                linkConfig: {
                  text: 'Learn more',
                  url: '{linkUrl}',
                },
              },
            ],
          },
          {
            id: 'teaching-methods',
            title: 'Teaching methods and pedagogy',
            layout: 'list',
            fields: [
              {
                key: 'platformQA',
                type: 'link',
                label: 'PLATFORM QA',
                subtitle: 'Quality-assured platform presence',
                tooltip: 'Learning platforms with quality assurance',
                format: '{value}',
              },
              {
                key: 'studentStaffRatio',
                type: 'link',
                label: 'STUDENT / STAFF RATIO',
                subtitle: 'Students per academic (FTE)',
                tooltip: 'Class size indicator',
                format: '{value}',
              },
            ],
          },
          {
            id: 'accessibility',
            title: 'Accessibility and inclusivity',
            layout: 'list',
            fields: [
              {
                key: 'studentBody',
                type: 'link',
                label: 'MAKE-UP OF THE STUDENT BODY',
                subtitle: 'Diversity statistics',
                tooltip: 'Student demographics',
                format: 'multiline',
              },
              {
                key: 'priorLearning',
                type: 'link',
                label: 'RECOGNITION OF PRIOR LEARNING',
                tooltip: 'RPL policies and procedures',
                format: '{value}',
                linkConfig: {
                  text: 'Learn more',
                  url: '{linkUrl}',
                },
              },
            ],
          },
        ],
      },
    ],
  },

  // ===== THEME CONFIGURATION =====
  theme: {
    colors: {
      primary: '#0b223b',
      primaryHover: '#0a1d31',
      secondary: '#1c64f2',
      secondaryHover: '#1e5cdb',
      background: '#f9fafb',
      link: '#2563eb',
    },
    logo: {
      url: '/assets/images/logo.png',
      name: 'QualityLink',
    },
    fonts: {
      primary: 'Inter, system-ui, -apple-system, sans-serif',
    },
    layout: {
      maxWidth: '1240px',
      cardAspectRatio: '16:9',
      gridColumns: {
        mobile: 1,
        tablet: 2,
        desktop: 3,
      },
    },
  },

  // ===== FORMAT CONFIGURATION =====
  formats: {
    currency: {
      template: '{value} {currency}',
      defaultCurrency: 'EUR',
    },
    ects: {
      template: '{value} ECTS',
      suffix: 'ECTS',
    },
    eqfLevel: {
      template: 'EQF {value}',
      prefix: 'EQF ',
    },
    percentage: {
      template: '{value}%',
      decimals: 0,
    },
    date: {
      template: '{value}',
      format: 'YYYY-MM-DD',
      locale: 'en-US',
    },
  },

  // ===== ICON CONFIGURATION =====
  icons: {
    deliveryMode: {
      Online: 'monitor',
      'In person': 'users',
      Blended: 'monitor-smartphone',
    },
    ects: 'clock',
    eqfLevel: 'graduation-cap',
    language: 'globe',
    location: 'map-pin',
    price: 'euro',
    calendar: 'calendar',
    provider: 'building',
    skills: 'award',
    assessment: 'clipboard-check',
  },
};
