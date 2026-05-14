import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { WindowProvider }       from '../context/WindowContext';
import { ThemeProvider }        from '../context/ThemeContext';
import { NotificationProvider } from '../context/NotificationContext';
import { ConfigProvider }       from '../context/ConfigContext';

// Boot / lock
import { BootScreen }  from '../components/boot/BootScreen';
import { LockScreen }  from '../components/boot/LockScreen';

// Desktop surface
import { Desktop } from '../components/desktop/Desktop';

// Windows layer
import { WindowManager } from '../components/windows/WindowManager';

// Start menu
import { StartMenu } from '../components/startmenu/StartMenu';

// Taskbar
import { Taskbar } from '../components/taskbar/Taskbar';

// Keyboard shortcut listener (must live inside WindowProvider)
import { useWindow } from '../hooks/useWindow';
function AppShortcuts() {
  const { openWindow } = useWindow();
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        openWindow('admin');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [openWindow]);
  return null;
}

// Welcome notification — fires once after config loads
import { useConfig }        from '../context/ConfigContext';
import { useNotification }  from '../context/NotificationContext';
function AppInit() {
  const { addNotification }    = useNotification();
  const { config, loading }    = useConfig();
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current || loading) return;
    fired.current = true;
    addNotification(`Welcome to ${config.ownerName}'s portfolio`, 'info');
  }, [loading, config.ownerName, addNotification]);
  return null;
}

// Notification layer
import { NotificationCenter } from '../components/notifications/NotificationCenter';
import { Toast }              from '../components/notifications/Toast';

// Easter eggs
import { BSOD } from '../components/easter/BSOD';

// ── Mobile fallback ─────────────────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return mobile;
}

function MobileFallback() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-6 select-none"
      style={{ background: '#1a1a1a', zIndex: 9999 }}
    >
      {/* Windows logo */}
      <svg width="56" height="56" viewBox="0 0 88 88" aria-hidden="true">
        <rect x="0"  y="0"  width="40" height="40" rx="3" fill="#f35325"/>
        <rect x="46" y="0"  width="40" height="40" rx="3" fill="#81bc06"/>
        <rect x="0"  y="46" width="40" height="40" rx="3" fill="#05a6f0"/>
        <rect x="46" y="46" width="40" height="40" rx="3" fill="#ffba08"/>
      </svg>
      <p className="text-white/90 text-center text-[1.05rem] leading-relaxed max-w-[260px]">
        This portfolio is best experienced on a desktop.
      </p>
      <p className="text-white/35 text-[11px] tracking-wide">
        Please open on a wider screen.
      </p>
    </div>
  );
}

// ── Konami code sequence ─────────────────────────────────────────────────────
const KONAMI_SEQ = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a',
];

/**
 * App — root orchestrator.
 *
 * Phase machine:
 *   'boot'    → BootScreen (2500 ms, then fades out)
 *   'lock'    → LockScreen (click to dismiss upward)
 *   'desktop' → full desktop UI
 */
export default function App() {
  const [phase,      setPhase]      = useState('boot');
  const [bsodActive, setBsodActive] = useState(false);
  const isMobile                    = useIsMobile();
  const konamiBuffer                = useRef([]);

  useEffect(() => {
    const handler = (e) => {
      konamiBuffer.current = [...konamiBuffer.current, e.key].slice(-KONAMI_SEQ.length);
      if (konamiBuffer.current.join(',') === KONAMI_SEQ.join(',')) {
        setBsodActive(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (isMobile)   return <MobileFallback />;
  if (bsodActive) return <BSOD />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ position: 'fixed', inset: 0 }}
    >
    <ThemeProvider>
      <NotificationProvider>
      <ConfigProvider>
      <WindowProvider>
        {/* ── Boot / Lock overlay layers (AnimatePresence handles exit animations) ── */}
        <AnimatePresence>
          {phase === 'boot' && (
            <BootScreen key="boot" onComplete={() => setPhase('lock')} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === 'lock' && (
            <LockScreen key="lock" onUnlock={() => setPhase('desktop')} />
          )}
        </AnimatePresence>

        {/* ── Desktop UI (always mounted beneath the overlays) ── */}
        {/* Layer 2 – desktop surface (RightClickMenu is rendered inside Desktop) */}
        <Desktop />

        {/* Layer 3 – draggable application windows */}
        <WindowManager />

        {/* Keyboard shortcuts (Ctrl+Shift+A → Admin) */}
        <AppShortcuts />

        {/* Welcome notification on first config load */}
        <AppInit />

        {/* Layer 4 – start menu overlay */}
        <StartMenu />

        {/* Layer 5 – taskbar (pinned to bottom) */}
        <Taskbar />

        {/* Layer 6 – notification panel + toasts */}
        <NotificationCenter />
        <Toast />
      </WindowProvider>
      </ConfigProvider>
      </NotificationProvider>
    </ThemeProvider>
    </motion.div>
  );
}
