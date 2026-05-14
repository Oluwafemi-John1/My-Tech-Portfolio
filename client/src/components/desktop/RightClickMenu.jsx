import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const MENU_ITEMS = ['View', 'Refresh', 'Personalize'];

/**
 * RightClickMenu
 * Props: { x, y, onClose, onPersonalize }
 *
 * Win11-style frosted-glass context menu.
 * Dismisses on outside click or Escape.
 */
export function RightClickMenu({ x, y, onClose, onPersonalize }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleDown(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handleDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.1 }}
      style={{
        position: 'fixed',
        left: x,
        top:  y,
        background: 'rgba(32,32,32,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--win-border)',
        zIndex: 9999,
      }}
      className="rounded-lg shadow-2xl py-1 min-w-45"
    >
      {MENU_ITEMS.map((item, i) => (
        <button
          key={item}
          onClick={() => {
            if (item === 'Personalize') {
              onPersonalize?.();
            } else if (item === 'Refresh') {
              // visual flash to simulate refresh
              document.documentElement.style.opacity = '0.6';
              setTimeout(() => { document.documentElement.style.opacity = ''; }, 150);
            }
            onClose();
          }}
          className="w-full text-left text-white/90 text-[12px] px-4 py-1.75
                     hover:bg-white/10 transition-colors rounded-sm"
        >
          {item}
        </button>
      ))}
    </motion.div>
  );
}

