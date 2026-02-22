import type { AppConfig } from './configTypes';

export const appConfig: AppConfig = {
  filters: {
    'elm:creditPoint.elm:point': {
      type: 'range',
      label: 'ECTS',
      icon: 'globe',
      enabled: true,
      meilisearchField: 'elm:creditPoint.elm:point',
      options: [],
    },
    'dcterms:language.skos:prefLabel': {
      type: 'select',
      label: 'Language',
      icon: 'globe',
      enabled: true,
      meilisearchField: 'dcterms:language.skos:prefLabel',
      options: [],
    },
    'ql:isActive': {
      type: 'toggle',
      label: 'Active Status',
      icon: 'check-circle',
      enabled: true,
      meilisearchField: 'ql:isActive',
      options: [],
    },
    'elm:EQFLevel.skos:prefLabel': {
      type: 'multiselect',
      label: 'EQF Level',
      icon: 'graduation-cap',
      enabled: true,
      meilisearchField: 'elm:EQFLevel.skos:prefLabel',
      options: [],
    },
    'elm:ISCEDFCode.skos:prefLabel': {
      type: 'multiselect',
      label: 'ISCED Code',
      icon: 'book',
      enabled: true,
      meilisearchField: 'elm:ISCEDFCode.skos:prefLabel',
      options: [],
    },
  },

  courseCard: {
    attributesToDisplay: ['id', 'dcterms:title', 'dcterms:description', 'ql:isActive', 'elm:EQFLevel', 'elm:learningOutcome', 'elm:creditPoint.elm:point', 'dcterms:language', 'dcterms:publisher', 'version'],
    image: {
      enabled: true,
      aspectRatio: '16:9',
      placeholder: '/assets/images/placeholder-course.svg',
    },
    fields: [
      {
        key: 'dcterms:title',
        type: 'text',
        label: null,
        position: 'header',
        format: '{value}',
        className: 'text-xl font-semibold text-gray-900',
      },
      {
        key: 'dcterms:publisher',
        type: 'text',
        label: null,
        position: 'subheader',
        format: '{value}',
        className: 'text-sm text-gray-600',
      },
      {
	key: 'elm:creditPoint.elm:point',
        type: 'badge',
        label: 'ECTS',
        position: 'badges',
        icon: 'clock',
        format: '{value} ECTS',
        className: 'bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded',
      },
      {
        key: 'elm:EQFLevel',
        type: 'badge',
        label: 'EQF Level',
        position: 'badges',
        icon: 'graduation-cap',
        format: 'EQF {value}',
        className: 'bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded',
      },
      {
        key: 'dcterms:language',
        type: 'badge',
        label: 'Language',
        position: 'badges',
        icon: 'globe',
        format: '{value}',
        className: 'bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded',
      },
      {
        key: 'ql:isActive',
        type: 'badge',
        label: 'Status',
        position: 'badges',
        icon: 'check',
        format: '{value}',
        className: 'bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded',
        valueMap: {
          'true': 'Active',
          'false': 'Inactive',
        },
      },
    ],
  },

  courseDetail: {
    tabs: [
      {
        id: 'basic-info',
        label: 'Basic Information',
        enabled: true,
        sections: [
          {
            id: 'info-cards',
            title: null,
            layout: 'grid',
            fields: [
              {
                key: 'type',
                type: 'info-card',
                label: 'TYPE',
                icon: 'folder',
                tooltip: 'Type of learning opportunity',
                format: '{value}',
              },
              {
		key: 'elm:creditPoint.elm:point',
                type: 'info-card',
                label: 'CREDITS',
                icon: 'clock',
                tooltip: 'European Credit Transfer and Accummulation System',
                format: '{value} ECTS',
              },
              {
                key: 'elm:EQFLevel',
                type: 'info-card',
                label: 'EQF LEVEL',
                icon: 'graduation-cap',
                tooltip: 'European Qualifications Framework level',
                format: 'EQF {value}',
              },
              {
                key: 'dcterms:language',
                type: 'info-card',
                label: 'LANGUAGE',
                icon: 'globe',
                tooltip: 'Language of instruction',
                format: '{value}',
              },
              {
                key: 'version',
                type: 'info-card',
                label: 'VERSION',
                icon: 'git-branch',
                tooltip: 'Course version',
                format: '{value}',
              },
              {
                key: 'ql:isActive',
                type: 'info-card',
                label: 'STATUS',
                icon: 'check-circle',
                tooltip: 'Course active status',
                format: '{value}',
                valueMap: {
                  'true': 'Active',
                  'false': 'Inactive',
                },
              },
            ],
          },
          {
            id: 'main-info',
            title: null,
            layout: 'list',
            fields: [
              {
                key: 'dcterms:description',
                type: 'text',
                label: 'DESCRIPTION',
                tooltip: 'Course description',
                format: '{value}',
              },
              {
                key: 'dcterms:publisher',
                type: 'link',
                label: 'PROVIDER',
                tooltip: 'Education institution publishing this course',
                format: '{value}',
              },
              {
                key: 'dcterms:publisher.regorg:legalName',
                type: 'link',
                label: 'OFFICIAL NAME',
                format: '{value}',
              },
              {
                key: 'elm:ISCEDFCode',
                type: 'link',
                label: 'ISCED CODE',
                tooltip: 'International Standard Classification of Education',
                format: '{value}',
              },
              {
                key: 'elm:learningOutcome',
                type: 'list',
                label: 'LEARNING OUTCOMES',
                tooltip: 'Detailed learning outcomes',
                format: 'bullet',
                icon: 'check-circle',
              },
            ],
          },
        ],
      },
      {
        id: 'metadata',
        label: 'Metadata',
        enabled: true,
        sections: [
          {
            id: 'identifiers',
            title: null,
            layout: 'list',
            fields: [
              {
                key: 'id',
                type: 'text',
                label: 'ID',
                tooltip: 'Unique identifier',
                format: '{value}',
              },
              {
                key: 'ql:ingestedAt',
                type: 'text',
                label: 'Last updated',
                tooltip: 'Timestamp when this course data was last fetched from the provider',
                format: '{value}',
              },
            ],
          },
        ],
      },
    ],
  },

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
