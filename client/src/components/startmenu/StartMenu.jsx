import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindow } from '../../hooks/useWindow';
import { Z }         from '../../utils/zIndex';

// ── Pinned app icons (inline SVG) ─────────────────────────────────────────────
function IconUser()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-[#60cdff]"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>; }
function IconFolder()   { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-[#ffd700]"><path d="M2 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z"/></svg>; }
function IconStar()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-[#a78bfa]"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>; }
function IconDoc()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-[#4ade80]"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>; }
function IconMail()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-[#f97316]"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>; }
function IconSettings() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-[#94a3b8]"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }

// Power icons
function IconMoon()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>; }
function IconRefresh() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>; }
function IconPower()   { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>; }
function IconSearch()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white/40"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
function IconCode()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>; }

// ── Static data ───────────────────────────────────────────────────────────────
const PINNED_APPS = [
  { id: 'about',    label: 'About Me', icon: <IconUser />     },
  { id: 'projects', label: 'Projects', icon: <IconFolder />   },
  { id: 'skills',   label: 'Skills',   icon: <IconStar />     },
  { id: 'resume',   label: 'Resume',   icon: <IconDoc />      },
  { id: 'contact',  label: 'Contact',  icon: <IconMail />     },
  { id: 'settings', label: 'Settings', icon: <IconSettings /> },
];

const RECOMMENDED = [
  { id: 'r1', title: 'Portfolio v2',    subtitle: 'React · Vite · Tailwind', icon: <IconCode /> },
  { id: 'r2', title: 'E-Commerce API',  subtitle: 'Node.js · MongoDB',       icon: <IconCode /> },
  { id: 'r3', title: 'Admin Dashboard', subtitle: 'Angular · Laravel',       icon: <IconCode /> },
];

// ── Shutdown screen ───────────────────────────────────────────────────────────
function ShutdownScreen() {
  return (
    <div
      className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-4 select-none"
      style={{ zIndex: 9999 }}
    >
      <span className="text-white/60 text-[13px] tracking-wide">
        It&rsquo;s safe to turn off your computer.
      </span>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-1.5 rounded-lg border border-white/15 text-white/40
                   text-[11px] hover:border-white/30 hover:text-white/60 transition-colors"
      >
        Restart
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function StartMenu() {
  const { startMenuOpen, toggleStart, openWindow } = useWindow();
  const [powerState, setPowerState] = useState(null); // null | 'sleep' | 'shutdown'

  function handlePinnedClick(id) {
    if (id !== 'settings') openWindow(id);
    toggleStart();
  }

  // Shutdown takes over the entire viewport
  if (powerState === 'shutdown') return <ShutdownScreen />;

  return (
    <>
      {/* Sleep overlay — click anywhere to wake */}
      {powerState === 'sleep' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/85 cursor-pointer"
          style={{ zIndex: 980 }}
          onClick={() => setPowerState(null)}
          title="Click to wake"
        />
      )}

      {/* Invisible backdrop — click outside to close menu */}
      <AnimatePresence>
        {startMenuOpen && (
          <motion.div
            key="start-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0"
            style={{ zIndex: Z.startMenu - 1 }}
            onClick={toggleStart}
          />
        )}
      </AnimatePresence>

      {/* ── Menu panel ── */}
      <AnimatePresence>
        {startMenuOpen && (
          <motion.div
            key="start-panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            className="fixed bottom-[52px] left-0 right-0 flex justify-center pointer-events-none"
            style={{ zIndex: Z.startMenu }}
          >
            <div
              className="w-[620px] rounded-xl overflow-hidden shadow-2xl pointer-events-auto"
              style={{
                background:          'rgba(24, 24, 28, 0.88)',
                backdropFilter:      'blur(40px)',
                WebkitBackdropFilter:'blur(40px)',
                border:              '1px solid rgba(255,255,255,0.10)',
              }}
            >
              {/* ── Search bar ── */}
              <div className="px-6 pt-5 pb-4">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg
                                bg-white/7 border border-white/8">
                  <IconSearch />
                  <input
                    type="text"
                    placeholder="Search apps, files, settings..."
                    className="flex-1 bg-transparent text-white/70 text-[13px]
                               outline-none placeholder:text-white/30"
                    readOnly
                  />
                </div>
              </div>

              {/* ── Pinned ── */}
              <div className="px-6 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/90 text-[13px] font-medium">Pinned</span>
                  <button className="text-white/35 text-[11px] hover:text-white/60 transition-colors">
                    All apps →
                  </button>
                </div>

                <div className="grid grid-cols-6 gap-0.5">
                  {PINNED_APPS.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => handlePinnedClick(app.id)}
                      className="flex flex-col items-center gap-1.5 px-1 py-3 rounded-lg
                                 hover:bg-white/10 transition-colors"
                    >
                      {app.icon}
                      <span className="text-white/70 text-[11px] text-center leading-tight">
                        {app.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/7 mx-6 mb-4" />

              {/* ── Recommended ── */}
              <div className="px-6 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/90 text-[13px] font-medium">Recommended</span>
                  <button className="text-white/35 text-[11px] hover:text-white/60 transition-colors">
                    More →
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {RECOMMENDED.map((item) => (
                    <button
                      key={item.id}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg text-left
                                 hover:bg-white/10 transition-colors"
                    >
                      <span className="w-8 h-8 flex items-center justify-center shrink-0
                                       bg-white/8 rounded-md text-white/50">
                        {item.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="text-white/80 text-[12px] font-medium truncate">
                          {item.title}
                        </div>
                        <div className="text-white/40 text-[10px] truncate mt-0.5">
                          {item.subtitle}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/7" />

              {/* ── Bottom bar ── */}
              <div className="flex items-center justify-between px-5 py-3">
                {/* User */}
                <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg
                                   hover:bg-white/10 transition-colors">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center
                                  text-white text-[11px] font-semibold shrink-0"
                    style={{ background: 'var(--win-accent)' }}>
                    OO
                  </div>
                  <span className="text-white/80 text-[13px]">Oluwafemi</span>
                </button>

                {/* Power buttons */}
                <div className="flex items-center gap-0.5">
                  {[
                    { id: 'sleep',    label: 'Sleep',     Icon: IconMoon,    action: () => { setPowerState('sleep');    toggleStart(); } },
                    { id: 'restart',  label: 'Restart',   Icon: IconRefresh, action: () => window.location.reload() },
                    { id: 'shutdown', label: 'Shut down', Icon: IconPower,   action: () => { setPowerState('shutdown'); toggleStart(); } },
                  ].map(({ id, label, Icon, action }) => (
                    <button
                      key={id}
                      onClick={action}
                      title={label}
                      className="flex items-center justify-center w-9 h-9 rounded-lg
                                 text-white/55 hover:bg-white/10 hover:text-white/90
                                 transition-colors"
                    >
                      <Icon />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

