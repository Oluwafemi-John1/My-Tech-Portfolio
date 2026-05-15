import { useRef, useEffect, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { useWindow } from '../../hooks/useWindow';

const TITLE_H = 40;
const MIN_W   = 320;
const MIN_H   = 200;
const H       = 8; // resize handle thickness (px)

// Each handle: which edges it controls
const HANDLES = [
  { dir: 'n',  top: 0,    left: H,    right: H,    height: H,    width: undefined, bottom: undefined, cursor: 'ns-resize'   },
  { dir: 's',  bottom: 0, left: H,    right: H,    height: H,    width: undefined, top: undefined,    cursor: 'ns-resize'   },
  { dir: 'w',  top: H,    bottom: H,  left: 0,     width: H,     height: undefined, right: undefined,  cursor: 'ew-resize'   },
  { dir: 'e',  top: H,    bottom: H,  right: 0,    width: H,     height: undefined, left: undefined,   cursor: 'ew-resize'   },
  { dir: 'nw', top: 0,    left: 0,    width: H,    height: H,    cursor: 'nw-resize'  },
  { dir: 'ne', top: 0,    right: 0,   width: H,    height: H,    cursor: 'ne-resize'  },
  { dir: 'sw', bottom: 0, left: 0,    width: H,    height: H,    cursor: 'sw-resize'  },
  { dir: 'se', bottom: 0, right: 0,   width: H,    height: H,    cursor: 'se-resize'  },
];

/**
 * WindowFrame
 * Props: { win: WindowObject, children: ReactNode }
 *
 * Draggable via title bar, resizable via edge/corner handles.
 * Framer Motion handles open/close animations (driven by AnimatePresence
 * in WindowManager).
 */
export function WindowFrame({ win, children }) {
  const {
    closeWindow, minimizeWindow, maximizeWindow,
    focusWindow, updatePosition, updateSize,
  } = useWindow();

  // ── Drag / resize — all in refs, never touches React state during gesture ─────
  const frameRef       = useRef(null);                      // direct DOM access
  const interactionRef = useRef(null);                      // live gesture data
  const listenersRef   = useRef({ move: null, up: null });  // stable handler refs

  // Always-fresh action callbacks — listener closures never go stale
  const actionsRef     = useRef({});
  actionsRef.current   = { updatePosition, updateSize };

  // After ANY React render that fires mid-drag (e.g. notification toast, theme
  // change) re-stamp the accumulated live position so React doesn't snap the
  // window back to the stale context value.
  useLayoutEffect(() => {
    if (!frameRef.current) return;
    const el = frameRef.current;
    // Always stamp z-index imperatively — Framer Motion caches the initial
    // style.zIndex MotionValue and may not propagate context updates to the DOM.
    el.style.zIndex = win.zIndex;
    // During drag / resize: re-stamp accumulated live position so React doesn't
    // snap the window back to the stale context value on unrelated re-renders.
    const s = interactionRef.current;
    if (!s) return;
    if (s.liveX !== undefined) el.style.left   = `${s.liveX}px`;
    if (s.liveY !== undefined) el.style.top    = `${s.liveY}px`;
    if (s.liveW !== undefined) el.style.width  = `${s.liveW}px`;
    if (s.liveH !== undefined) el.style.height = `${s.liveH}px`;
  }); // intentionally no deps — must run after every render

  // Belt-and-suspenders: remove listeners if the window unmounts mid-drag
  useEffect(() => {
    return () => {
      const { move, up } = listenersRef.current;
      if (move) window.removeEventListener('mousemove', move);
      if (up)   window.removeEventListener('mouseup',   up);
    };
  }, []);

  // Called from onTitleMouseDown / onResizeMouseDown.
  // Attaches window-level listeners; they are removed inside onMouseUp
  // (and again on unmount above for safety).
  function startDrag() {
    const onMouseMove = (e) => {
      const s = interactionRef.current;
      if (!s || !frameRef.current) return;
      const el = frameRef.current;
      const dx = e.clientX - s.startX;
      const dy = e.clientY - s.startY;

      if (s.type === 'drag') {
        // Mutate ref directly — zero React renders during drag
        s.liveX = Math.max(0, s.pos0X + dx);
        s.liveY = Math.max(0, s.pos0Y + dy);
        el.style.left = `${s.liveX}px`;
        el.style.top  = `${s.liveY}px`;
      } else {
        let nx = s.pos0X, ny = s.pos0Y;
        let nw = s.w0,    nh = s.h0;
        if (s.dir.includes('e')) { nw = Math.max(MIN_W, s.w0 + dx); }
        if (s.dir.includes('s')) { nh = Math.max(MIN_H, s.h0 + dy); }
        if (s.dir.includes('w')) { nw = Math.max(MIN_W, s.w0 - dx); nx = s.pos0X + (s.w0 - nw); }
        if (s.dir.includes('n')) { nh = Math.max(MIN_H, s.h0 - dy); ny = s.pos0Y + (s.h0 - nh); }
        s.liveX = nx; s.liveY = ny; s.liveW = nw; s.liveH = nh;
        el.style.left   = `${nx}px`;
        el.style.top    = `${ny}px`;
        el.style.width  = `${nw}px`;
        el.style.height = `${nh}px`;
      }
    };

    const onMouseUp = () => {
      const s = interactionRef.current;
      if (s) {
        // One context update — triggers a single React render to sync state
        actionsRef.current.updatePosition(s.id, {
          x: s.liveX ?? s.pos0X,
          y: s.liveY ?? s.pos0Y,
        });
        if (s.type === 'resize') {
          actionsRef.current.updateSize(s.id, {
            width:  s.liveW ?? s.w0,
            height: s.liveH ?? s.h0,
          });
        }
        interactionRef.current = null;
      }
      // Clean up immediately — cursor might be anywhere in the viewport
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',   onMouseUp);
      listenersRef.current = { move: null, up: null };
    };

    // Remove stale listeners before attaching fresh ones (guards double-click edge case)
    const { move, up } = listenersRef.current;
    if (move) window.removeEventListener('mousemove', move);
    if (up)   window.removeEventListener('mouseup',   up);

    listenersRef.current = { move: onMouseMove, up: onMouseUp };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',   onMouseUp);
  }

  function onTitleMouseDown(e) {
    if (e.button !== 0 || win.isMaximized) return;
    e.preventDefault();
    focusWindow(win.id);
    interactionRef.current = {
      type: 'drag', id: win.id,
      startX: e.clientX, startY: e.clientY,
      pos0X: win.position.x, pos0Y: win.position.y,
    };
    startDrag();
  }

  function onResizeMouseDown(dir, e) {
    if (e.button !== 0 || win.isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    focusWindow(win.id);
    interactionRef.current = {
      type: 'resize', id: win.id, dir,
      startX: e.clientX, startY: e.clientY,
      pos0X: win.position.x, pos0Y: win.position.y,
      w0: win.size.width, h0: win.size.height,
    };
    startDrag();
  }

  return (
    <motion.div
      ref={frameRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.12, ease: 'easeIn' } }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      onClick={() => focusWindow(win.id)}
      style={{
        position:            'absolute',
        left:                win.position.x,
        top:                 win.position.y,
        width:               win.size.width,
        height:              win.size.height,
        zIndex:              win.zIndex,
        pointerEvents:       'auto',
        background:          'var(--win-surface)',
        backdropFilter:      'blur(20px)',
        WebkitBackdropFilter:'blur(20px)',
        border:              '1px solid var(--win-border)',
        borderRadius:        win.isMaximized ? 0 : 8,
        overflow:            'hidden',
        boxShadow:           win.isFocused
          ? '0 16px 48px rgba(0,0,0,0.6)'
          : '0 8px 24px rgba(0,0,0,0.4)',
        display:             'flex',
        flexDirection:       'column',
      }}
    >
      {/* ── Resize handles (hidden when maximized) ─────────────────── */}
      {!win.isMaximized && HANDLES.map(({ dir, cursor, ...pos }) => (
        <div
          key={dir}
          style={{ position: 'absolute', ...pos, cursor, zIndex: 1 }}
          onMouseDown={(e) => onResizeMouseDown(dir, e)}
        />
      ))}

      {/* ── Title bar ───────────────────────────────────────────────── */}
      <div
        style={{ height: TITLE_H, flexShrink: 0, cursor: win.isMaximized ? 'default' : 'grab' }}
        className="flex items-center justify-between px-3 select-none"
        onMouseDown={onTitleMouseDown}
        onDoubleClick={() => maximizeWindow(win.id)}
      >
        {/* Left: icon + title */}
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          {win.icon && (
            <span className="w-4 h-4 shrink-0 flex items-center justify-center"
              style={{ color: 'var(--win-title-btn)' }}>
              {win.icon}
            </span>
          )}
          <span className="text-[13px] font-medium truncate"
            style={{ color: 'var(--win-text)' }}>
            {win.title}
          </span>
        </div>

        {/* Right: control buttons — stop drag propagation */}
        <div
          className="flex items-center shrink-0 -mr-3 ml-4"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Minimize */}
          <button
            onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }}
            className="flex items-center justify-center w-11 h-10 transition-colors"
            style={{ color: 'var(--win-title-btn)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--win-title-btn-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            title="Minimize"
          >
            {/* — */}
            <span className="block w-3 h-px bg-current" />
          </button>

          {/* Maximize / Restore */}
          <button
            onClick={(e) => { e.stopPropagation(); maximizeWindow(win.id); }}
            className="flex items-center justify-center w-11 h-10 transition-colors"
            style={{ color: 'var(--win-title-btn)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--win-title-btn-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            title={win.isMaximized ? 'Restore' : 'Maximize'}
          >
            {win.isMaximized ? (
              // Restore: two overlapping squares
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <rect x="3.5" y="0.5" width="7" height="7" rx="1"
                  stroke="currentColor" strokeWidth="1.2" />
                <path d="M0.5 3.5h2.5v7h7v-2.5"
                  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            ) : (
              // Maximize: hollow square
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <rect x="0.6" y="0.6" width="8.8" height="8.8" rx="1"
                  stroke="currentColor" strokeWidth="1.2" />
              </svg>
            )}
          </button>

          {/* Close — red on hover */}
          <button
            onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
            className="flex items-center justify-center w-11 h-10 transition-colors"
            style={{ color: 'var(--win-title-btn)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#e81123'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--win-title-btn)'; }}
            title="Close"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1 9 9M9 1 1 9"
                stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Content area ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto relative">
        {children}
      </div>
    </motion.div>
  );
}
