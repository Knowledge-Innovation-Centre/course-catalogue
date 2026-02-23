import { MeiliSearch } from 'meilisearch';
import { MEILISEARCH_CONFIG, COURSES_INDEX } from '../config/meilisearch';
import type { AppConfig } from '../configTypes';

const client = new MeiliSearch(MEILISEARCH_CONFIG);
const index = client.index(COURSES_INDEX);

export interface SearchParams {
  query?: string;
  filters?: Record<string, string | string[] | [number, number] | undefined>;
  attributesToRetrieve?: string[];
  page?: number;
  limit?: number;
  sort?: string[];
}

function buildFilterString(filters?: SearchParams['filters']): string | undefined {
  if (!filters) return undefined;

  const filterParts: string[] = [];

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value) && value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number') {
      // Range filter - numeric min/max
      filterParts.push(`"${key}" >= ${value[0]} AND "${key}" <= ${value[1]}`);
    } else if (Array.isArray(value) && value.length > 0) {
      // Multiselect filter - OR together
      const orFilters = value
        .map((v) => `"${key}" = "${v}"`)
        .join(' OR ');
      filterParts.push(`(${orFilters})`);
    } else if (typeof value === 'string' && value !== 'all' && value.length > 0) {
      // Single select filter
      filterParts.push(`"${key}" = "${value}"`);
    }
  });

  return filterParts.length > 0 ? filterParts.join(' AND ') : undefined;
}

export async function searchCourses(
  params: SearchParams,
  config: AppConfig
) {
  const {
    query = '',
    filters,
    attributesToRetrieve = config.courseCard.attributesToDisplay,
    page = 1,
    limit = 20,
    sort,
  } = params;

  const offset = (page - 1) * limit;
  const filterString = buildFilterString(filters);

  try {
    const results = await index.search(query, {
      filter: filterString,
      attributesToRetrieve,
      // attributesToHighlight: ['*'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
      limit,
      offset,
      sort,
    });

    return {
      courses: results.hits,
      total: results.estimatedTotalHits || 0,
      page,
      limit,
      hasMore: offset + limit < (results.estimatedTotalHits || 0),
      processingTimeMs: results.processingTimeMs,
    };
  } catch (error) {
    console.error('Search error:', error);
    throw new Error('Failed to search courses');
  }
}

export async function getCourseById(id: string) {
  try {
    const course = await index.getDocument(id);
    return course;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw new Error('Course not found');
  }
}

export async function getRelatedCourses(
  courseId: string,
  categories: string[],
  limit: number = 4
) {
  try {
    const filterString = categories.length > 0
      ? `(${categories.map((c) => `categories = "${c}"`).join(' OR ')})`
      : undefined;

    const results = await index.search('', {
      filter: filterString,
      limit: limit + 1, // Get one extra to exclude current course
    });

    // Filter out the current course
    const related = results.hits.filter((course: any) => course.id !== courseId);

    return related.slice(0, limit);
  } catch (error) {
    console.error('Error fetching related courses:', error);
    return [];
  }
}
