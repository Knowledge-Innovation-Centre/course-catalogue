import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AppConfig } from './configTypes';
import { exampleConfig } from './exampleConfig';

interface ConfigContextType {
  config: AppConfig | null;
  loading: boolean;
  error: Error | null;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
  /**
   * Optional config URL. If not provided, uses '/api/config'
   */
  configUrl?: string;
  /**
   * Optional fallback config to use if API fails or during development
   */
  fallbackConfig?: AppConfig;
}

/**
 * ConfigProvider
 *
 * Loads the application configuration on mount and provides it to child components.
 * The config should be loaded ONCE at app initialization and contains:
 * - Filter definitions
 * - Course card field layout
 * - Course detail structure (tabs, sections, fields)
 * - Theme settings
 * - Icon mappings
 * - Format templates
 *
 * Usage:
 * ```tsx
 * <ConfigProvider>
 *   <App />
 * </ConfigProvider>
 * ```
 */
export function ConfigProvider({
  children,
  configUrl = '/api/config',
  fallbackConfig = exampleConfig
}: ConfigProviderProps) {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadConfig() {
      try {
        const response = await fetch(configUrl);

        if (!response.ok) {
          throw new Error(`Failed to load config: ${response.statusText}`);
        }

        const data = await response.json();

        if (isMounted) {
          setConfig(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load config from API, using fallback:', err);

        if (isMounted) {
          setError(err as Error);
          // Use fallback config in case of error
          setConfig(fallbackConfig);
          setLoading(false);
        }
      }
    }

    loadConfig();

    return () => {
      isMounted = false;
    };
  }, [configUrl, fallbackConfig]);

  return (
    <ConfigContext.Provider value={{ config, loading, error }}>
      {children}
    </ConfigContext.Provider>
  );
}

/**
 * useConfig Hook
 *
 * Access the application configuration from any component.
 *
 * Usage:
 * ```tsx
 * const { config, loading, error } = useConfig();
 *
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 *
 * // Use config
 * config.courseDetail.tabs.forEach(...)
 * ```
 */
export function useConfig(): ConfigContextType {
  const context = useContext(ConfigContext);

  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }

  return context;
}

/**
 * useConfigOrDefault Hook
 *
 * Like useConfig, but returns a default config instead of throwing if used outside provider.
 * Useful for testing or development.
 */
export function useConfigOrDefault(defaultConfig: AppConfig = exampleConfig): AppConfig {
  const context = useContext(ConfigContext);

  if (context === undefined) {
    console.warn('useConfigOrDefault used outside ConfigProvider, using default config');
    return defaultConfig;
  }

  return context.config || defaultConfig;
}
