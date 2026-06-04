import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { type SiteSettings, DEFAULT_SETTINGS } from '../types/settings';
import { api } from '../utils/api';

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  updateSettings: (updates: Partial<SiteSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await api<Partial<SiteSettings>>('/settings');
        if (active) setSettings({ ...DEFAULT_SETTINGS, ...data });
      } catch {
        // keep defaults if the API is unreachable
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const updateSettings = useCallback(
    async (updates: Partial<SiteSettings>) => {
      const merged = { ...DEFAULT_SETTINGS, ...settings, ...updates };
      const saved = await api<Partial<SiteSettings>>('/settings', {
        method: 'PUT',
        body: merged,
        auth: true,
      });
      setSettings({ ...DEFAULT_SETTINGS, ...saved });
    },
    [settings]
  );

  const resetSettings = useCallback(async () => {
    const saved = await api<Partial<SiteSettings>>('/settings', {
      method: 'PUT',
      body: DEFAULT_SETTINGS,
      auth: true,
    });
    setSettings({ ...DEFAULT_SETTINGS, ...saved });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
}
