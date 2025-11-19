import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AppConfig } from './configTypes';
import { appConfig } from './config';
import { populateFiltersWithFacets } from './services/facetService';

interface ConfigContextType {
  config: AppConfig | null;
  loading: boolean;
  error: Error | null;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
  fallbackConfig?: AppConfig;
}

export function ConfigProvider({
  children,
  fallbackConfig = appConfig
}: ConfigProviderProps) {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadConfig() {
      try {
        let currentConfig = { ...fallbackConfig };
        const populatedConfig = await populateFiltersWithFacets(currentConfig);

        if (isMounted) {
          setConfig(populatedConfig);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to populate config with facets, using fallback:', err);
        if (isMounted) {
          setError(err as Error);
          setConfig(fallbackConfig);
          setLoading(false);
        }
      }
    }

    loadConfig();

    return () => {
      isMounted = false;
    };
  }, [fallbackConfig]);

  return (
    <ConfigContext.Provider value={{ config, loading, error }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig(): ConfigContextType {
  const context = useContext(ConfigContext);

  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }

  return context;
}

export function useConfigOrDefault(defaultConfig: AppConfig = appConfig): AppConfig {
  const context = useContext(ConfigContext);

  if (context === undefined) {
    console.warn('useConfigOrDefault used outside ConfigProvider, using default config');
    return defaultConfig;
  }

  return context.config || defaultConfig;
}
