import { useWindow } from '../../hooks/useWindow';
import { TaskbarIcon } from './TaskbarIcon';
import { SystemTray }  from './SystemTray';
import { Z } from '../../utils/zIndex';

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
        {windows.map((w) => (
          <TaskbarIcon
            key={w.id}
            id={w.id}
            label={w.title}
            icon={w.icon}
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
