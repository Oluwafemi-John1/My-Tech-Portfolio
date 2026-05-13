import { AnimatePresence, motion } from 'framer-motion';
import { useNotification }        from '../../context/NotificationContext';
import { Z }                      from '../../utils/zIndex';

// ── Per-type config (border + icon colour) ────────────────────────────────────
const TYPE = {
  success: { border: '#22c55e', iconColor: '#86efac' },
  error:   { border: '#ef4444', iconColor: '#fca5a5' },
  info:    { border: '#60a5fa', iconColor: '#93c5fd' },
  warning: { border: '#f59e0b', iconColor: '#fcd34d' },
};

// ── Icons ─────────────────────────────────────────────────────────────────────
function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className="w-4 h-4">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className="w-4 h-4">
      <line x1="18" y1="6" x2="6"  y2="18" />
      <line x1="6"  y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IconInfo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className="w-4 h-4">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8"  x2="12"    y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
function IconWarn() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className="w-4 h-4">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9"  x2="12"    y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

const ICONS = { success: <IconCheck />, error: <IconX />, info: <IconInfo />, warning: <IconWarn /> };

// ── Dismiss X ─────────────────────────────────────────────────────────────────
function DismissX() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5">
      <line x1="18" y1="6" x2="6"  y2="18" />
      <line x1="6"  y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ── Toast stack ───────────────────────────────────────────────────────────────
export function Toast() {
  const { toasts, removeToast } = useNotification();

  return (
    <div
      className="fixed right-4 flex flex-col gap-2 pointer-events-none"
      style={{ zIndex: Z.toast, bottom: 64 }}
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const cfg = TYPE[t.type] ?? TYPE.info;
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 56,  scale: 0.94 }}
              animate={{ opacity: 1, x: 0,   scale: 1    }}
              exit={{    opacity: 0, x: 56,  scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="pointer-events-auto flex items-start gap-3 px-3.5 py-3 rounded-xl shadow-2xl"
              style={{
                width:               300,
                background:          'rgba(26,26,30,0.93)',
                backdropFilter:      'blur(24px)',
                WebkitBackdropFilter:'blur(24px)',
                border:              '1px solid rgba(255,255,255,0.10)',
                borderLeft:          `3px solid ${cfg.border}`,
              }}
            >
              {/* Type icon */}
              <span className="mt-0.5 shrink-0" style={{ color: cfg.iconColor }}>
                {ICONS[t.type] ?? ICONS.info}
              </span>

              {/* Message */}
              <span className="flex-1 text-white/85 text-[12.5px] leading-snug">
                {t.message}
              </span>

              {/* Dismiss */}
              <button
                onClick={() => removeToast(t.id)}
                className="mt-0.5 shrink-0 text-white/30 hover:text-white/70 transition-colors"
                aria-label="Dismiss"
              >
                <DismissX />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

