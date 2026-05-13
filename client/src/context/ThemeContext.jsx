import { createContext, useContext, useEffect, useState } from 'react';

// ── Accent palette ────────────────────────────────────────────────────────────
export const ACCENT_COLORS = [
  { label: 'Blue',   value: '#0078D4' },
  { label: 'Purple', value: '#744DA9' },
  { label: 'Green',  value: '#107C10' },
  { label: 'Red',    value: '#C50F1F' },
  { label: 'Orange', value: '#CA5010' },
];

const ThemeContext = createContext(null);

// Writes CSS variables + data-theme directly onto <html> so every component
// that references var(--win-*) picks up the change instantly.
function applyTheme(mode, accent) {
  const root = document.documentElement;
  root.setAttribute('data-theme', mode);
  root.style.setProperty('--win-accent', accent);
  root.style.setProperty('--win-bg',     accent);

  if (mode === 'dark') {
    root.style.setProperty('--win-taskbar', 'rgba(32, 32, 32, 0.85)');
    root.style.setProperty('--win-glass',   'rgba(255, 255, 255, 0.08)');
    root.style.setProperty('--win-border',  'rgba(255, 255, 255, 0.12)');
    root.style.setProperty('--win-surface', 'rgba(32, 32, 32, 0.92)');
  } else {
    root.style.setProperty('--win-taskbar', 'rgba(243, 243, 243, 0.85)');
    root.style.setProperty('--win-glass',   'rgba(255, 255, 255, 0.72)');
    root.style.setProperty('--win-border',  'rgba(0, 0, 0, 0.10)');
    root.style.setProperty('--win-surface', 'rgba(251, 251, 251, 0.90)');
  }
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(
    () => localStorage.getItem('win-mode') ?? 'dark'
  );

  const [accentColor, setAccentState] = useState(
    () => localStorage.getItem('win-accent') ?? '#0078D4'
  );

  // Apply on every change and on first mount
  useEffect(() => {
    applyTheme(mode, accentColor);
  }, [mode, accentColor]);

  const toggleMode = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    localStorage.setItem('win-mode', next);
    setMode(next);
  };

  const setAccent = (color) => {
    localStorage.setItem('win-accent', color);
    setAccentState(color);
  };

  return (
    <ThemeContext.Provider
      value={{ mode, accentColor, toggleMode, setAccent, ACCENT_COLORS }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}

