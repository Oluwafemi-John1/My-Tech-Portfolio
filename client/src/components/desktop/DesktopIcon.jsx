import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * DesktopIcon
 * Props: { id, label, icon (ReactNode), onOpen }
 *
 * Single-click → selects.
 * Double-click → calls onOpen(id).
 */
export function DesktopIcon({ id, label, icon, onOpen }) {
  const [selected, setSelected] = useState(false);
  const clickTimer = useRef(null);

  function handleClick() {
    if (clickTimer.current) {
      // second click within 300 ms → double-click
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      onOpen?.(id);
    } else {
      setSelected(true);
      clickTimer.current = setTimeout(() => {
        clickTimer.current = null;
      }, 300);
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      onBlur={() => setSelected(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={[
        'flex flex-col items-center gap-1 p-2 rounded-lg w-20',
        'text-white text-[11px] text-center wrap-break-word cursor-default select-none',
        'transition-colors focus:outline-none',
        selected ? 'bg-white/20' : 'hover:bg-white/10',
      ].join(' ')}
    >
      {/* Icon area – 40 × 40 */}
      <span className="w-10 h-10 flex items-center justify-center">{icon}</span>
      {/* Label */}
      <span className="leading-tight line-clamp-2 w-full">{label}</span>
    </motion.button>
  );
}

