import { useState, useCallback } from 'react';
import { AnimatePresence }       from 'framer-motion';
import { useWindow }             from '../../hooks/useWindow';
import { useConfig }             from '../../context/ConfigContext';
import { Z }                     from '../../utils/zIndex';
import { DesktopIcon }           from './DesktopIcon';
import { RightClickMenu }        from './RightClickMenu';

// ── Inline SVG icon helpers ──────────────────────────────────────────────────
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className="w-9 h-9 text-[#60cdff]">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className="w-9 h-9 text-[#ffd700]">
      <path d="M2 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className="w-9 h-9 text-[#a78bfa]">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className="w-9 h-9 text-[#4ade80]">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="12" y2="17" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className="w-9 h-9 text-[#f97316]">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="2,4 12,13 22,4" />
    </svg>
  );
}

// ── Desktop icon definitions ─────────────────────────────────────────────────
const ICONS = [
  { id: 'about',    label: 'About Me',  icon: <UserIcon />     },
  { id: 'projects', label: 'Projects',  icon: <FolderIcon />   },
  { id: 'skills',   label: 'Skills',    icon: <SparkleIcon />  },
  { id: 'resume',   label: 'Resume',    icon: <DocumentIcon /> },
  { id: 'contact',  label: 'Contact',   icon: <MailIcon />     },
];

const FALLBACK_WALLPAPER = 'https://picsum.photos/seed/win11/1920/1080';

// ── Component ─────────────────────────────────────────────────────
export function Desktop() {
  const { openWindow } = useWindow();
  const { config }     = useConfig();
  const wallpaper      = config.wallpaper || FALLBACK_WALLPAPER;
  const [menu, setMenu] = useState(null); // { x, y } | null

  const handleContextMenu = useCallback((e) => {
    // Only trigger on the desktop background itself
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        zIndex: Z.desktop,
        backgroundImage: `url('${wallpaper}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onContextMenu={handleContextMenu}
      // dismiss menu on left-click on background
      onClick={() => setMenu(null)}
    >
      {/* ── Icon grid (top-left, 80 px columns, 100 px rows) ── */}
      <div
        className="absolute top-4 left-4 grid gap-1"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, 80px)',
          gridAutoRows: '100px',
        }}
      >
        {ICONS.map((item) => (
          <DesktopIcon
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            onOpen={openWindow}
          />
        ))}
      </div>

      {/* ── Right-click context menu ── */}
      <AnimatePresence>
        {menu && (
          <RightClickMenu
            key="rcm"
            x={menu.x}
            y={menu.y}
            onClose={() => setMenu(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

