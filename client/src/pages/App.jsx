import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';

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

/**
 * App — root orchestrator.
 *
 * Phase machine:
 *   'boot'    → BootScreen (2500 ms, then fades out)
 *   'lock'    → LockScreen (click to dismiss upward)
 *   'desktop' → full desktop UI
 */
export default function App() {
  const [phase, setPhase] = useState('boot');

  return (
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
  );
}
