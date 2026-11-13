// Base URL of the QualityLink backend API. Empty string = same origin as the frontend.
export const API_BASE_URL: string = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '');
