import type { CourseListItem } from './courseDataTypes';

/**
 * Mock Course List Data (VALUES ONLY)
 *
 * Structure comes from config.courseCard.fields
 * These courses contain ONLY data values - the fields displayed
 * are determined by the config
 */
export const mockCourses: CourseListItem[] = [
  {
    id: '1',
    title: 'Honey Bee Health (Apiculture)',
    university: 'University of Galway',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png',
    // Dynamic fields (keys match config.courseCard.fields[].key)
    ects: 5,
    abc: 5,
    efg: 5,
    eqfLevel: 6,
    deliveryMode: 'Blended',
    language: 'English'
  },
  {
    id: '2',
    title: 'Advanced Data Science',
    university: 'Technical University of Munich',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png',
    ects: 10,
    eqfLevel: 7,
    deliveryMode: 'Online',
    language: 'English'
  },
  {
    id: '3',
    title: 'Sustainable Agriculture',
    university: 'Wageningen University',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png',
    ects: 6,
    eqfLevel: 6,
    deliveryMode: 'Blended',
    language: 'English'
  },
  {
    id: '4',
    title: 'Digital Marketing Fundamentals',
    university: 'Dublin City University',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png',
    ects: 5,
    eqfLevel: 5,
    deliveryMode: 'Online',
    language: 'English'
  },
  {
    id: '5',
    title: 'Introduction to AI',
    university: 'University of Amsterdam',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png',
    ects: 8,
    eqfLevel: 6,
    deliveryMode: 'Blended',
    language: 'English'
  },
  {
    id: '6',
    title: 'Climate Change Policy',
    university: 'University of Copenhagen',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png',
    ects: 5,
    eqfLevel: 7,
    deliveryMode: 'Online',
    language: 'English'
  },
  {
    id: '7',
    title: 'Web Development Bootcamp',
    university: 'University of Galway',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/2560px-Placeholder_view_vector.svg.png',
    ects: 12,
    eqfLevel: 6,
    deliveryMode: 'Blended',
    language: 'English'
  }
];
