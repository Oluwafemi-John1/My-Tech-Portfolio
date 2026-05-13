import { useRef, useEffect, useState } from 'react';
import { AnimatePresence, motion }     from 'framer-motion';
import { useNotification }             from '../../context/NotificationContext';
import { Z }                           from '../../utils/zIndex';

// ── Relative timestamp ────────────────────────────────────────────────────────
function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 10)    return 'just now';
  if (s < 60)    return `${s}s ago`;
  if (s < 3600)  return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

// ── Per-type colour + icon ────────────────────────────────────────────────────
const TYPE = {
  success: { color: '#22c55e' },
  error:   { color: '#ef4444' },
  info:    { color: '#60a5fa' },
  warning: { color: '#f59e0b' },
};

function NotifIcon({ type }) {
  const color = (TYPE[type] ?? TYPE.info).color;
  const cls   = 'w-3.5 h-3.5';
  if (type === 'success') return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
  if (type === 'error') return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <line x1="18" y1="6" x2="6"  y2="18" />
      <line x1="6"  y1="6" x2="18" y2="18" />
    </svg>
  );
  if (type === 'warning') return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9"  x2="12"    y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8"  x2="12"    y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

// ── Live-tick wrapper so relative times update every 30 s ─────────────────────
function useNow() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);
}

// ── Main component ────────────────────────────────────────────────────────────
export function NotificationCenter() {
  const { notifications, panelOpen, togglePanel, clearAll } = useNotification();
  const ref = useRef(null);
  useNow(); // re-render every 30 s so timestamps stay fresh

  // Close on outside click
  useEffect(() => {
    if (!panelOpen) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) togglePanel();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [panelOpen, togglePanel]);

  return (
    <AnimatePresence>
      {panelOpen && (
        <motion.div
          ref={ref}
          key="notif-center"
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1    }}
          exit={{    opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
          className="fixed right-2 flex flex-col overflow-hidden rounded-xl shadow-2xl"
          style={{
            bottom:              60,
            width:               320,
            maxHeight:           400,
            zIndex:              Z.notificationPanel,
            background:          'rgba(22,22,26,0.92)',
            backdropFilter:      'blur(32px)',
            WebkitBackdropFilter:'blur(32px)',
            border:              '1px solid rgba(255,255,255,0.10)',
          }}
        >
          {/* ── Header ── */}
          <div
            className="flex items-center justify-between px-4 py-2.5 shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span className="text-white/80 text-[13px] font-medium">Notifications</span>
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="text-white/35 hover:text-white/65 text-[11px] transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* ── List ── */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  className="w-8 h-8 text-white/15">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <p className="text-white/25 text-[12px]">No notifications</p>
              </div>
            ) : (
              notifications.map((n) => {
                const typeColor = (TYPE[n.type] ?? TYPE.info).color;
                return (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/4"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    {/* Coloured dot */}
                    <span
                      className="mt-1 w-2 h-2 rounded-full shrink-0"
                      style={{ background: typeColor }}
                    />

                    <div className="flex-1 min-w-0">
                      <p className={`text-[12px] leading-snug ${n.read ? 'text-white/45' : 'text-white/80'}`}>
                        {n.message}
                      </p>
                      <p className="text-white/28 text-[10px] mt-0.5">{timeAgo(n.timestamp)}</p>
                    </div>

                    {/* Type icon */}
                    <span className="mt-0.5 shrink-0">
                      <NotifIcon type={n.type} />
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
