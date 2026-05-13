import { useWindow } from '../../hooks/useWindow';
import { TaskbarIcon } from './TaskbarIcon';
import { SystemTray }  from './SystemTray';
import { Z } from '../../utils/zIndex';

// ── Per-window icon map (mirrors desktop icon colours) ──────────
const WINDOW_ICONS = {
  about: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#60cdff" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  projects: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M2 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z" />
    </svg>
  ),
  skills: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  ),
  resume: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="12" y2="17" />
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="2,4 12,13 22,4" />
    </svg>
  ),
};

// ── Windows logo (4-pane) for the Start button ──────────────────
function WinLogo() {
  return (
    <div className="grid grid-cols-2 gap-[2px] w-4 h-4">
      <div className="rounded-[1px]" style={{ background: '#F25022' }} />
      <div className="rounded-[1px]" style={{ background: '#7FBA00' }} />
      <div className="rounded-[1px]" style={{ background: '#00A4EF' }} />
      <div className="rounded-[1px]" style={{ background: '#FFB900' }} />
    </div>
  );
}

/**
 * Taskbar
 * Fixed to bottom, 48 px tall.
 * Left:   Start button
 * Center: open-window TaskbarIcons
 * Right:  SystemTray
 */
export function Taskbar() {
  const { windows, toggleStart } = useWindow();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-12 flex items-center px-2"
      style={{
        background: 'var(--win-taskbar)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: Z.taskbar,
        borderTop: '1px solid var(--win-border)',
      }}
    >
      {/* ── Start button ──────────────────────────────── */}
      <button
        onClick={toggleStart}
        className="flex items-center justify-center w-10 h-10 rounded
                   hover:bg-white/10 transition-colors"
        title="Start"
      >
        <WinLogo />
      </button>

      {/* ── Open-window icons ──────────────────────────── */}
      <div className="flex-1 flex items-center justify-center gap-1">
        {windows.filter((w) => w.id !== 'admin').map((w) => (
          <TaskbarIcon
            key={w.id}
            id={w.id}
            label={w.title}
            icon={WINDOW_ICONS[w.id] ?? null}
            isOpen={w.isOpen && !w.isMinimized}
            isFocused={w.isFocused}
          />
        ))}
      </div>

      {/* ── System tray ────────────────────────────────── */}
      <SystemTray />
    </div>
  );
}
