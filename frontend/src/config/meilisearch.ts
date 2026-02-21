if (!import.meta.env.VITE_MEILISEARCH_HOST || !import.meta.env.VITE_MEILISEARCH_KEY) {
  throw new Error('Missing required environment variables: VITE_MEILISEARCH_HOST and VITE_MEILISEARCH_KEY must be set in .env file');
}

export const MEILISEARCH_CONFIG = {
  host: import.meta.env.VITE_MEILISEARCH_HOST,
  apiKey: import.meta.env.VITE_MEILISEARCH_KEY,
};

export const COURSES_INDEX = import.meta.env.VITE_MEILISEARCH_INDEX;
