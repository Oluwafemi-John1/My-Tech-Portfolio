import { useState } from 'react';
import { useWindow } from '../../hooks/useWindow';

/**
 * TaskbarIcon
 * Props: { id, label, icon (ReactNode), isOpen, isFocused }
 *
 * - Focused + open  → click minimizes
 * - Minimized / closed → click opens / focuses
 */
export function TaskbarIcon({ id, label, icon, isOpen, isFocused }) {
  const [hovered, setHovered] = useState(false);
  const { openWindow, minimizeWindow, focusWindow } = useWindow();

  function handleClick() {
    if (isOpen && isFocused) {
      minimizeWindow(id);
    } else if (isOpen) {
      focusWindow(id);
    } else {
      openWindow(id, label);
    }
  }

  return (
    <div className="relative flex items-center justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tooltip */}
      {hovered && (
        <div
          className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap
                     bg-[rgba(32,32,32,0.95)] text-white text-[11px] px-2 py-1
                     rounded shadow-lg pointer-events-none z-50"
        >
          {label}
        </div>
      )}

      {/* Icon button */}
      <button
        onClick={handleClick}
        className={[
          'flex items-center justify-center w-10 h-10 rounded transition-colors',
          isFocused
            ? 'bg-white/20'
            : 'hover:bg-white/10',
        ].join(' ')}
        title={label}
      >
        {icon
          ? <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
          : <span className="text-white/70 text-[12px] font-medium select-none">
              {label?.[0]?.toUpperCase() ?? '?'}
            </span>
        }
      </button>

      {/* Active indicator bar */}
      {isOpen && (
        <span
          className={[
            'absolute bottom-0.5 rounded-full h-[3px] transition-all duration-150',
            isFocused ? 'w-4 bg-[var(--win-bg)]' : 'w-2 bg-white/50',
          ].join(' ')}
        />
      )}
    </div>
  );
}
