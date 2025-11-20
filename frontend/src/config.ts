import type { AppConfig } from './configTypes';

export const appConfig: AppConfig = {
  filters: {
    entity_type: {
      type: 'multiselect',
      label: 'Entity Type',
      icon: 'folder',
      enabled: true,
      meilisearchField: 'entity_type',
      options: [],
    },
    type: {
      type: 'multiselect',
      label: 'Type',
      icon: 'tag',
      enabled: true,
      meilisearchField: 'type',
      options: [],
    },
    language: {
      type: 'select',
      label: 'Language',
      icon: 'globe',
      enabled: true,
      meilisearchField: 'language',
      options: [],
    },
    is_active: {
      type: 'select',
      label: 'Active Status',
      icon: 'check-circle',
      enabled: true,
      meilisearchField: 'is_active',
      options: [],
    },
  },

  courseCard: {
    attributesToDisplay: ['id', 'title', 'description', 'type', 'entity_type', 'is_active', 'learning_outcomes_count'],
    image: {
      enabled: true,
      aspectRatio: '16:9',
      placeholder: '/assets/images/placeholder-course.svg',
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
        key: 'type',
        type: 'text',
        label: null,
        position: 'subheader',
        format: '{value}',
        className: 'text-sm text-gray-600',
      },
      {
        key: 'entity_type',
        type: 'badge',
        label: 'Type',
        position: 'badges',
        icon: 'folder',
        format: '{value}',
        className: 'bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded',
      },
      {
        key: 'learning_outcomes_count',
        type: 'badge',
        label: 'Outcomes',
        position: 'badges',
        icon: 'check-circle',
        format: '{value} outcomes',
        className: 'bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded',
      },
      {
        key: 'is_active',
        type: 'badge',
        label: 'Status',
        position: 'badges',
        icon: 'check',
        format: '{value}',
        className: 'bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded',
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
                key: 'entity_type',
                type: 'info-card',
                label: 'ENTITY TYPE',
                icon: 'tag',
                tooltip: 'Entity classification',
                format: '{value}',
              },
              {
                key: 'language',
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
                key: 'is_active',
                type: 'info-card',
                label: 'STATUS',
                icon: 'check-circle',
                tooltip: 'Course active status',
                format: '{value}',
              },
              {
                key: 'learning_outcomes_count',
                type: 'info-card',
                label: 'LEARNING OUTCOMES',
                icon: 'list',
                tooltip: 'Number of learning outcomes',
                format: '{value} outcomes',
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
                tooltip: 'Course description',
                format: '{value}',
              },
              {
                key: 'publisher',
                type: 'link',
                label: 'PUBLISHER',
                tooltip: 'Organization publishing this course',
                format: '{value}',
              },
              {
                key: 'isced_code',
                type: 'link',
                label: 'ISCED CODE',
                tooltip: 'International Standard Classification of Education',
                format: '{value}',
              },
              {
                key: 'learning_outcomes',
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
                key: 'original_uri',
                type: 'text',
                label: 'ORIGINAL URI',
                tooltip: 'Original URI from source system',
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
