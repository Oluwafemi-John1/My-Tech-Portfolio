import { useState } from 'react';
import { useThemeContext, ACCENT_COLORS } from '../../context/ThemeContext';
import { useConfig }                      from '../../context/ConfigContext';

// ── Wallpaper presets ──────────────────────────────────────────────────────────
const WALLPAPER_PRESETS = [
  { label: 'Bloom',     url: 'https://picsum.photos/seed/win11/1920/1080'    },
  { label: 'Mountains', url: 'https://picsum.photos/seed/alpine/1920/1080'   },
  { label: 'Ocean',     url: 'https://picsum.photos/seed/wave11/1920/1080'   },
  { label: 'Forest',    url: 'https://picsum.photos/seed/forest7/1920/1080'  },
  { label: 'City',      url: 'https://picsum.photos/seed/city42/1920/1080'   },
  { label: 'Abstract',  url: 'https://picsum.photos/seed/abstract3/1920/1080'},
];

// ── Sidebar icon helpers ───────────────────────────────────────────────────────
function PaintIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5"  cy="7.5"  r=".5" fill="currentColor" />
      <circle cx="6.5"  cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688
               0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0
               0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965
               6.012 17.461 2 12 2z" />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

// ── Section divider ────────────────────────────────────────────────────────────
function Divider() {
  return <hr className="border-[var(--win-border)] my-4" />;
}

// ── Section heading ────────────────────────────────────────────────────────────
function SectionHead({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h2 className="text-[18px] font-semibold" style={{ color: 'var(--win-text)' }}>{title}</h2>
      {subtitle && (
        <p className="text-[12px] mt-0.5" style={{ color: 'var(--win-text-muted)' }}>{subtitle}</p>
      )}
    </div>
  );
}

// ── Setting row ────────────────────────────────────────────────────────────────
function SettingCard({ children }) {
  return (
    <div
      className="rounded-lg px-4 py-3.5 mb-2"
      style={{ background: 'var(--win-surface-2)' }}
    >
      {children}
    </div>
  );
}

// ── Personalization section ────────────────────────────────────────────────────
function PersonalizationSection({ mode, toggleMode, accentColor, setAccent, wallpaper, applyWallpaper }) {
  const [customUrl, setCustomUrl] = useState('');

  function submitCustom(e) {
    e.preventDefault();
    const trimmed = customUrl.trim();
    if (trimmed) {
      applyWallpaper(trimmed);
      setCustomUrl('');
    }
  }

  return (
    <div>
      <SectionHead title="Personalization" subtitle="Colours, lock screen, themes" />

      {/* Background ─────────────────────────────────────────────── */}
      <SettingCard>
        <p className="text-[12px] font-semibold uppercase tracking-wide mb-3"
          style={{ color: 'var(--win-text-muted)' }}>
          Background
        </p>

        {/* Wallpaper grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {WALLPAPER_PRESETS.map((w) => (
            <button
              key={w.label}
              title={w.label}
              onClick={() => applyWallpaper(w.url)}
              className="relative aspect-video rounded overflow-hidden group"
              style={{
                outline: wallpaper === w.url ? '2px solid var(--win-accent)' : '2px solid transparent',
                outlineOffset: '2px',
              }}
            >
              <img
                src={`${w.url.replace('1920/1080', '200/120')}`}
                alt={w.label}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <span
                className="absolute bottom-0 left-0 right-0 text-[10px] text-center py-0.5
                           opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}
              >
                {w.label}
              </span>
            </button>
          ))}
        </div>

        {/* Custom URL */}
        <form onSubmit={submitCustom} className="flex gap-2">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Paste custom image URL…"
            className="flex-1 px-3 py-1.5 rounded text-[12px] outline-none"
            style={{
              background: 'var(--win-hover)',
              border:     '1px solid var(--win-border)',
              color:      'var(--win-text)',
            }}
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded text-[12px] font-medium transition-opacity hover:opacity-80"
            style={{ background: 'var(--win-accent)', color: '#fff' }}
          >
            Apply
          </button>
        </form>
      </SettingCard>

      <Divider />

      {/* Theme mode ─────────────────────────────────────────────── */}
      <SettingCard>
        <p className="text-[12px] font-semibold uppercase tracking-wide mb-3"
          style={{ color: 'var(--win-text-muted)' }}>
          Choose your mode
        </p>
        <div className="flex gap-3">
          {/* Light card */}
          <button
            onClick={() => mode === 'dark' && toggleMode()}
            className="flex-1 rounded-lg overflow-hidden text-left transition-all"
            style={{
              outline: mode === 'light' ? '2px solid var(--win-accent)' : '2px solid var(--win-border)',
              outlineOffset: '2px',
            }}
          >
            {/* Preview */}
            <div className="h-16 flex flex-col justify-end p-1.5"
              style={{ background: 'linear-gradient(135deg,#e8f4fd,#cce4f6)' }}>
              <div className="flex gap-1">
                <div className="h-1.5 w-8 rounded-full bg-white/80" />
                <div className="h-1.5 w-5 rounded-full bg-white/60" />
              </div>
              <div className="h-3 mt-1 rounded"
                style={{ background: 'rgba(255,255,255,0.75)' }} />
            </div>
            <div className="px-2 py-1.5 flex items-center justify-between"
              style={{ background: 'var(--win-surface-2)' }}>
              <span className="text-[12px]" style={{ color: 'var(--win-text)' }}>Light</span>
              {mode === 'light' && (
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
                  stroke="var(--win-accent)" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </button>

          {/* Dark card */}
          <button
            onClick={() => mode === 'light' && toggleMode()}
            className="flex-1 rounded-lg overflow-hidden text-left transition-all"
            style={{
              outline: mode === 'dark' ? '2px solid var(--win-accent)' : '2px solid var(--win-border)',
              outlineOffset: '2px',
            }}
          >
            <div className="h-16 flex flex-col justify-end p-1.5"
              style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)' }}>
              <div className="flex gap-1">
                <div className="h-1.5 w-8 rounded-full bg-white/30" />
                <div className="h-1.5 w-5 rounded-full bg-white/20" />
              </div>
              <div className="h-3 mt-1 rounded" style={{ background: 'rgba(255,255,255,0.12)' }} />
            </div>
            <div className="px-2 py-1.5 flex items-center justify-between"
              style={{ background: 'var(--win-surface-2)' }}>
              <span className="text-[12px]" style={{ color: 'var(--win-text)' }}>Dark</span>
              {mode === 'dark' && (
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
                  stroke="var(--win-accent)" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </SettingCard>

      <Divider />

      {/* Accent color ───────────────────────────────────────────── */}
      <SettingCard>
        <p className="text-[12px] font-semibold uppercase tracking-wide mb-3"
          style={{ color: 'var(--win-text-muted)' }}>
          Accent colour
        </p>
        <div className="flex gap-2.5 flex-wrap">
          {ACCENT_COLORS.map((ac) => (
            <button
              key={ac.value}
              title={ac.label}
              onClick={() => setAccent(ac.value)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{
                background:  ac.value,
                outline:     accentColor === ac.value ? `3px solid ${ac.value}` : '3px solid transparent',
                outlineOffset: '3px',
              }}
            >
              {accentColor === ac.value && (
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
                  stroke="#fff" strokeWidth="3" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
        <p className="text-[11px] mt-2.5" style={{ color: 'var(--win-text-muted)' }}>
          Selected: {ACCENT_COLORS.find((a) => a.value === accentColor)?.label ?? accentColor}
        </p>
      </SettingCard>
    </div>
  );
}

// ── System section ─────────────────────────────────────────────────────────────
function SystemSection({ config }) {
  const info = [
    ['Owner',      config.ownerName || '—'],
    ['Status',     config.status    || '—'],
    ['Framework',  'React 19 + Vite 6'],
    ['Styling',    'Tailwind CSS v4'],
    ['Backend',    'Express 5 + MongoDB'],
    ['Animations', 'Framer Motion 12'],
    ['Version',    '2.0.0'],
  ];

  return (
    <div>
      <SectionHead title="System" subtitle="About this portfolio" />
      <SettingCard>
        <table className="w-full text-[12px]">
          <tbody>
            {info.map(([label, value]) => (
              <tr key={label} className="border-b last:border-0" style={{ borderColor: 'var(--win-border)' }}>
                <td className="py-2 pr-4 w-32" style={{ color: 'var(--win-text-muted)' }}>{label}</td>
                <td className="py-2 font-medium" style={{ color: 'var(--win-text)' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SettingCard>

      <Divider />

      <SettingCard>
        <p className="text-[12px] font-semibold uppercase tracking-wide mb-2"
          style={{ color: 'var(--win-text-muted)' }}>
          About the developer
        </p>
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--win-text)' }}>
          {config.bio || 'Full-stack developer passionate about building beautiful, performant web experiences.'}
        </p>
      </SettingCard>
    </div>
  );
}

// ── Accounts section ───────────────────────────────────────────────────────────
function AccountsSection({ config }) {
  const links = config.socialLinks ?? {};

  return (
    <div>
      <SectionHead title="Accounts" subtitle="Social profiles and contact" />
      <SettingCard>
        <div className="flex items-center gap-3 mb-4">
          {config.avatarUrl ? (
            <img src={config.avatarUrl} alt="avatar"
              className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-[18px] font-bold"
              style={{ background: 'var(--win-accent)' }}
            >
              {(config.ownerName || 'U')[0].toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-[14px] font-semibold" style={{ color: 'var(--win-text)' }}>
              {config.ownerName || 'Portfolio User'}
            </p>
            <p className="text-[11px]" style={{ color: 'var(--win-text-muted)' }}>
              {config.status || 'Developer'}
            </p>
          </div>
        </div>
        <Divider />
        {[['GitHub', links.github], ['LinkedIn', links.linkedin], ['Twitter / X', links.twitter]]
          .filter(([, url]) => url)
          .map(([label, url]) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center justify-between py-2.5 px-1 rounded
                         hover:bg-[var(--win-hover)] transition-colors text-[12px]"
              style={{ color: 'var(--win-text)' }}
            >
              <span>{label}</span>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          ))
        }
        {!links.github && !links.linkedin && !links.twitter && (
          <p className="text-[12px]" style={{ color: 'var(--win-text-muted)' }}>
            No social links configured. Add them via the Admin Panel.
          </p>
        )}
      </SettingCard>
    </div>
  );
}

// ── Sidebar item ───────────────────────────────────────────────────────────────
function SideItem({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-colors text-left"
      style={{
        background: active ? 'var(--win-hover)' : 'transparent',
        color:      active ? 'var(--win-text)' : 'var(--win-text-muted)',
        fontWeight: active ? 500 : 400,
      }}
    >
      <span style={{ color: active ? 'var(--win-accent)' : 'var(--win-text-muted)' }}>
        {icon}
      </span>
      {label}
    </button>
  );
}

const SECTIONS = [
  { id: 'personalization', label: 'Personalization', icon: <PaintIcon /> },
  { id: 'system',          label: 'System',          icon: <SystemIcon /> },
  { id: 'accounts',        label: 'Accounts',        icon: <AccountIcon /> },
];

// ── Main component ─────────────────────────────────────────────────────────────
export function SettingsWindow({ initialSection = 'personalization' }) {
  const { mode, toggleMode, accentColor, setAccent } = useThemeContext();
  const { config, setConfig }                        = useConfig();
  const [section, setSection]                        = useState(initialSection);

  function applyWallpaper(url) {
    setConfig((prev) => ({ ...prev, wallpaper: url }));
    localStorage.setItem('win-wallpaper', url);
  }

  return (
    <div className="flex h-full select-none" style={{ color: 'var(--win-text)' }}>
      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <div
        className="w-52 shrink-0 flex flex-col gap-0.5 p-3 overflow-y-auto"
        style={{ borderRight: '1px solid var(--win-border)' }}
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 px-3 py-3 mb-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round"
            className="w-5 h-5" style={{ color: 'var(--win-text-muted)' }}>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65
              1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9
              19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0
              4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65
              0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65
              0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06
              -.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2
              2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span className="text-[15px] font-semibold" style={{ color: 'var(--win-text)' }}>
            Settings
          </span>
        </div>

        {SECTIONS.map((s) => (
          <SideItem
            key={s.id}
            label={s.label}
            icon={s.icon}
            active={section === s.id}
            onClick={() => setSection(s.id)}
          />
        ))}
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-5">
        {section === 'personalization' && (
          <PersonalizationSection
            mode={mode}
            toggleMode={toggleMode}
            accentColor={accentColor}
            setAccent={setAccent}
            wallpaper={config.wallpaper}
            applyWallpaper={applyWallpaper}
          />
        )}
        {section === 'system'   && <SystemSection   config={config} />}
        {section === 'accounts' && <AccountsSection config={config} />}
      </div>
    </div>
  );
}
