import { MeiliSearch } from 'meilisearch';
import { MEILISEARCH_CONFIG, COURSES_INDEX } from '../config/meilisearch';

const client = new MeiliSearch(MEILISEARCH_CONFIG);
const index = client.index(COURSES_INDEX);

export interface FacetHit {
  value: string;
  count: number;
}

export async function fetchFacet(facetName: string): Promise<FacetHit[]> {
  try {
    const response = await index.searchForFacetValues({
      facetName,
      facetQuery: '',
    });

    return response.facetHits;
  } catch (error) {
    console.error(`Error fetching facet ${facetName}:`, error);
    return [];
  }
}

export async function fetchMultipleFacets(
  facetNames: string[]
): Promise<Record<string, FacetHit[]>> {
  try {
    const results = await index.search('', {
      limit: 0,
      facets: facetNames
    });

    const facetsMap: Record<string, FacetHit[]> = {};

    if (results.facetDistribution) {
      Object.entries(results.facetDistribution).forEach(([facetName, distribution]) => {
        facetsMap[facetName] = Object.entries(distribution).map(([value, count]) => ({
          value: String(value),
          count: count as number
        }));
      });
    }

    return facetsMap;
  } catch (error) {
    console.error('Error fetching multiple facets:', error);
    return {};
  }
}

export async function discoverAllFieldsAndValues(): Promise<{
  filterableFields: Record<string, FacetHit[]>;
  displayedAttributes: string[];
  sampleDocument: any;
}> {
  try {
    const [settings, documents] = await Promise.all([
      index.getSettings(),
      index.getDocuments({ limit: 1 })
    ]);

    const filterableFields = (settings.filterableAttributes || [])
      .map(attr => typeof attr === 'string' ? attr : (attr as any).attribute)
      .filter((name): name is string => name !== undefined && name !== null);

    let facetsData: Record<string, FacetHit[]> = {};
    if (filterableFields.length > 0) {
      facetsData = await fetchMultipleFacets(filterableFields);
    }

    let displayedAttributes: string[] = [];
    const settingsDisplayedAttributes = settings.displayedAttributes;
    if (!settingsDisplayedAttributes || (Array.isArray(settingsDisplayedAttributes) && settingsDisplayedAttributes.includes('*'))) {
      if (documents.results.length > 0) {
        displayedAttributes = Object.keys(documents.results[0]);
      }
    } else {
      displayedAttributes = settingsDisplayedAttributes as string[];
    }

    const sampleDocument = documents.results.length > 0 ? documents.results[0] : null;

    return {
      filterableFields: facetsData,
      displayedAttributes,
      sampleDocument
    };
  } catch (error) {
    console.error('Error discovering fields:', error);
    return {
      filterableFields: {},
      displayedAttributes: [],
      sampleDocument: null
    };
  }
}

/**
 * Get range statistics for numeric fields (optional)
 */
export async function getRangeStats(field: string) {
  try {
    // Search with no query to get all documents
    const results = await index.search('', {
      limit: 0, // Don't need actual results
      facets: [field],
    });

    if (results.facetDistribution && results.facetDistribution[field]) {
      const values = Object.keys(results.facetDistribution[field])
        .map(Number)
        .filter((n) => !isNaN(n));

      if (values.length > 0) {
        return {
          min: Math.min(...values),
          max: Math.max(...values),
        };
      }
    }

    return null;
  } catch (error) {
    console.error(`Error fetching range stats for ${field}:`, error);
    return null;
  }
}
