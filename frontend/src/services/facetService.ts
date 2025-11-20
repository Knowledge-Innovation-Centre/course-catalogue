import { MeiliSearch } from 'meilisearch';
import { MEILISEARCH_CONFIG, COURSES_INDEX } from '../config/meilisearch';
import type { AppConfig } from '../configTypes';

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
    const facetPromises = facetNames.map(async (name) => {
      const hits = await fetchFacet(name);
      return { name, hits };
    });

    const results = await Promise.all(facetPromises);
    const facetsMap: Record<string, FacetHit[]> = {};
    results.forEach(({ name, hits }) => {
      facetsMap[name] = hits;
    });
    return facetsMap;
  } catch (error) {
    console.error('Error fetching multiple facets:', error);
    return {};
  }
}

export async function getIndexSettings() {
  try {
    const settings = await index.getSettings();
    return {
      filterableAttributes: settings.filterableAttributes || [],
      sortableAttributes: settings.sortableAttributes || [],
      searchableAttributes: settings.searchableAttributes || [],
    };
  } catch (error) {
    console.error('Error fetching index settings:', error);
    return {
      filterableAttributes: [],
      sortableAttributes: [],
      searchableAttributes: [],
    };
  }
}

export async function populateFiltersWithFacets(
  config: AppConfig
): Promise<AppConfig> {
  try {
    // Get all multiselect/select filters that need facet data
    const facetFilters = Object.entries(config.filters)
      .filter(
        ([_, filter]) =>
          (filter.type === 'multiselect' || filter.type === 'select') &&
          'meilisearchField' in filter
      )
      .map(([_, filter]) => (filter as any).meilisearchField);

    if (facetFilters.length === 0) {
      return config;
    }

    // Fetch all facets
    const facetsData = await fetchMultipleFacets(facetFilters);

    // Create a new config with populated options
    const populatedConfig = { ...config };
    populatedConfig.filters = { ...config.filters };

    // Populate each filter with facet data
    Object.entries(populatedConfig.filters).forEach(([, filter]) => {
      if (
        (filter.type === 'multiselect' || filter.type === 'select') &&
        'meilisearchField' in filter
      ) {
        const meilisearchField = (filter as any).meilisearchField;
        const facetHits = facetsData[meilisearchField] || [];

        // Convert facet hits to filter options
        (filter as any).options = facetHits.map((hit) => ({
          value: hit.value,
          label: hit.value.charAt(0).toUpperCase() + hit.value.slice(1), // Capitalize
          count: hit.count, // Optional: can display count in UI
        }));
      }
    });

    return populatedConfig;
  } catch (error) {
    console.error('Error populating filters with facets:', error);
    return config; // Return original config on error
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
