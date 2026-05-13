import { AnimatePresence, motion } from 'framer-motion';
import { useNotification }        from '../../context/NotificationContext';
import { Z }                      from '../../utils/zIndex';

// ── Per-type colours ──────────────────────────────────────────────────────────
const BG = {
  success: 'rgba(16, 124, 16, 0.92)',
  error:   'rgba(197, 15,  31, 0.92)',
  info:    'rgba(30,  30,  36, 0.92)',
};

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className="w-4 h-4 shrink-0">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className="w-4 h-4 shrink-0">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6"  y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className="w-4 h-4 shrink-0">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

const TYPE_ICON = { success: <IconCheck />, error: <IconX />, info: <IconInfo /> };

// ── Toast stack ───────────────────────────────────────────────────────────────
export function Toast() {
  const { toasts, removeToast } = useNotification();

  return (
    <div
      className="fixed bottom-16 right-4 flex flex-col gap-2 pointer-events-none"
      style={{ zIndex: Z.toast }}
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 64,  scale: 0.94 }}
            animate={{ opacity: 1, x: 0,   scale: 1    }}
            exit={{    opacity: 0, x: 64,  scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3
                       rounded-xl shadow-2xl text-white"
            style={{
              background:          BG[toast.type] ?? BG.info,
              backdropFilter:      'blur(24px)',
              WebkitBackdropFilter:'blur(24px)',
              border:              '1px solid rgba(255,255,255,0.12)',
              minWidth:            240,
              maxWidth:            320,
            }}
          >
            {/* Type icon */}
            <span className="opacity-80">{TYPE_ICON[toast.type]}</span>

            {/* Message */}
            <span className="flex-1 text-[13px] leading-snug">{toast.message}</span>

            {/* Dismiss */}
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-50 hover:opacity-90 transition-opacity ml-1"
              aria-label="Dismiss"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5">
                <line x1="18" y1="6" x2="6"  y2="18" />
                <line x1="6"  y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

