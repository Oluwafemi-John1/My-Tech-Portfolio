import { Clock }           from './Clock';
import { useNotification } from '../../context/NotificationContext';

// ── Inline SVG icons (static) ──────────────────────────────────
function WifiIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <circle cx="12" cy="20" r="1" fill="currentColor" />
    </svg>
  );
}

function SoundIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
      <line x1="23" y1="13" x2="23" y2="11" />
      <rect x="3" y="8" width="12" height="8" rx="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

// ── Component ──────────────────────────────────────────────
const trayIcons = [
  { id: 'wifi',    Icon: WifiIcon    },
  { id: 'sound',   Icon: SoundIcon   },
  { id: 'battery', Icon: BatteryIcon },
];

export function SystemTray() {
  const { unreadCount, togglePanel } = useNotification();

  return (
    <div className="flex items-center h-full gap-1 pl-1 pr-2">
      {trayIcons.map(({ id, Icon }) => (
        <button
          key={id}
          className="flex items-center justify-center w-8 h-8 rounded text-white/80
                     hover:bg-white/10 transition-colors"
        >
          <Icon />
        </button>
      ))}

      {/* Bell — notification center toggle */}
      <button
        onClick={togglePanel}
        className="relative flex items-center justify-center w-8 h-8 rounded
                   text-white/80 hover:bg-white/10 transition-colors"
        title="Notification Center"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2"
            style={{ ringColor: 'transparent' }}
          />
        )}
      </button>

      <Clock />
    </div>
  );
}
