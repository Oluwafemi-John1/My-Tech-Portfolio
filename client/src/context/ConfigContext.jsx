import { createContext, useContext, useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

// ── Fallback used while loading or when the API is unreachable ────────────────
const DEFAULT_CONFIG = {
  ownerName:   'Oluwafemi Oyeniran',
  bio:         'Full-stack developer passionate about building beautiful, performant web experiences. Specialising in React, Node.js, and modern UI systems.',
  status:      'Tech portfolio',
  avatarUrl:   '',
  wallpaper:   'https://picsum.photos/seed/win11/1920/1080',
  socialLinks: { github: '', linkedin: '', twitter: '' },
};

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
  const [config,  setConfig]  = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/config`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        // Merge so any fields absent from the DB still get the default value
        setConfig((prev) => ({
          ...prev,
          ...data,
          socialLinks: { ...prev.socialLinks, ...(data.socialLinks ?? {}) },
        }));
      })
      .catch(() => { /* keep defaults — server may not be running in dev */ })
      .finally(() => setLoading(false));
  }, []);

  return (
    <ConfigContext.Provider value={{ config, setConfig, loading }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfig must be used inside <ConfigProvider>');
  return ctx;
}
