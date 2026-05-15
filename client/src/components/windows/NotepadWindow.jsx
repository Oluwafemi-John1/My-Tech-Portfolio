/**
 * NotepadWindow — classic text editor window.
 *
 * Features:
 *  - Full-width textarea, monospace 13 px, line-height 1.6
 *  - Auto-saves to localStorage ('portfolio_notepad') with 500 ms debounce
 *  - Loads saved content on mount
 *  - Menu bar: File (New / Save / Close), Edit (Undo / Select All),
 *              View (Word Wrap toggle, Font Size small/medium/large)
 *  - Status bar: live character count + line count
 *  - Window title shows asterisk (*) when there are unsaved changes
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useWindow } from '../../hooks/useWindow';

const WIN_ID     = 'notepad';
const LS_KEY     = 'portfolio_notepad';
const BASE_TITLE = 'Notepad';
const FONT_PX    = { small: 11, medium: 13, large: 16 };

export function NotepadWindow() {
  const { closeWindow, updateTitle } = useWindow();

  // ── Persistent text & saved snapshot ────────────────────────────────────
  const [text,      setText]      = useState(() => localStorage.getItem(LS_KEY) ?? '');
  const [savedText, setSavedText] = useState(() => localStorage.getItem(LS_KEY) ?? '');

  // ── UI toggles ────────────────────────────────────────────────────────────
  const [savedFlash, setSavedFlash] = useState(false);          // "Saved ✓" badge
  const [wordWrap,   setWordWrap]   = useState(true);
  const [fontSize,   setFontSize]   = useState('medium');       // 'small'|'medium'|'large'
  const [openMenu,   setOpenMenu]   = useState(null);           // null|'File'|'Edit'|'View'

  const taRef       = useRef(null);  // <textarea> DOM node
  const debounceRef = useRef(null);  // auto-save timer
  const flashRef    = useRef(null);  // "Saved" flash timer

  // ── Derived ───────────────────────────────────────────────────────────────
  const isDirty   = text !== savedText;
  const charCount = text.length;
  const lineCount = text === '' ? 1 : text.split('\n').length;

  // ── Title-bar asterisk ────────────────────────────────────────────────────
  useEffect(() => {
    updateTitle(WIN_ID, isDirty ? `* ${BASE_TITLE}` : BASE_TITLE);
  }, [isDirty, updateTitle]);

  // ── Auto-save with 500 ms debounce ────────────────────────────────────────
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      localStorage.setItem(LS_KEY, text);
      setSavedText(text);
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [text]);

  // ── Close menus on any outside click ─────────────────────────────────────
  useEffect(() => {
    if (!openMenu) return;
    const close = () => setOpenMenu(null);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [openMenu]);

  // ── Cleanup timers on unmount ─────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearTimeout(debounceRef.current);
      clearTimeout(flashRef.current);
    };
  }, []);

  // ── File actions ──────────────────────────────────────────────────────────
  const save = useCallback(() => {
    clearTimeout(debounceRef.current);
    localStorage.setItem(LS_KEY, text);
    setSavedText(text);
    setSavedFlash(true);
    clearTimeout(flashRef.current);
    flashRef.current = setTimeout(() => setSavedFlash(false), 1500);
  }, [text]);

  const newFile = useCallback(() => {
    if (
      isDirty &&
      !window.confirm('You have unsaved changes.\n\nCreate a new file anyway?')
    ) return;
    clearTimeout(debounceRef.current);
    localStorage.setItem(LS_KEY, '');
    setText('');
    setSavedText('');
  }, [isDirty]);

  const handleClose = useCallback(() => {
    if (
      isDirty &&
      !window.confirm('You have unsaved changes.\n\nClose Notepad anyway?')
    ) return;
    closeWindow(WIN_ID);
  }, [isDirty, closeWindow]);

  // ── Menu definition ───────────────────────────────────────────────────────
  const MENUS = [
    {
      label: 'File',
      items: [
        { label: 'New',   action: newFile },
        { label: 'Save',  action: save },
        { sep: true },
        { label: 'Close', action: handleClose },
      ],
    },
    {
      label: 'Edit',
      items: [
        // execCommand('undo') is deprecated but still functional for textareas
        { label: 'Undo',       action: () => { taRef.current?.focus(); document.execCommand('undo'); } },
        { sep: true },
        { label: 'Select All', action: () => { taRef.current?.select(); } },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'Word Wrap', action: () => setWordWrap((v) => !v), check: wordWrap },
        { sep: true },
        { label: 'Font Size', disabled: true },
        { label: '  Small',   action: () => setFontSize('small'),   check: fontSize === 'small'  },
        { label: '  Medium',  action: () => setFontSize('medium'),  check: fontSize === 'medium' },
        { label: '  Large',   action: () => setFontSize('large'),   check: fontSize === 'large'  },
      ],
    },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        display:       'flex',
        flexDirection: 'column',
        height:        '100%',
        overflow:      'hidden',
        background:    'var(--win-surface)',
      }}
    >
      {/* ── Menu bar ──────────────────────────────────────────────────────── */}
      <div
        style={{
          display:      'flex',
          flexShrink:   0,
          borderBottom: '1px solid var(--win-border)',
          background:   'var(--win-surface)',
          userSelect:   'none',
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {MENUS.map((menu) => (
          <div key={menu.label} style={{ position: 'relative' }}>
            {/* ── Trigger ── */}
            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                setOpenMenu((prev) => (prev === menu.label ? null : menu.label));
              }}
              style={{
                background:   openMenu === menu.label ? 'var(--win-accent)' : 'transparent',
                color:        openMenu === menu.label ? '#fff' : 'var(--win-text)',
                border:       'none',
                padding:      '4px 10px',
                cursor:       'pointer',
                fontSize:     13,
                borderRadius: 3,
              }}
            >
              {menu.label}
            </button>

            {/* ── Dropdown ── */}
            {openMenu === menu.label && (
              <div
                style={{
                  position:     'absolute',
                  top:          '100%',
                  left:         0,
                  zIndex:       9999,
                  minWidth:     150,
                  background:   'var(--win-surface)',
                  border:       '1px solid var(--win-border)',
                  borderRadius: 6,
                  boxShadow:    '0 4px 16px rgba(0,0,0,0.22)',
                  padding:      '3px 0',
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {menu.items.map((item, idx) =>
                  item.sep ? (
                    <div
                      key={idx}
                      style={{
                        height:     1,
                        background: 'var(--win-border)',
                        margin:     '3px 8px',
                      }}
                    />
                  ) : (
                    <button
                      key={idx}
                      disabled={item.disabled}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        if (!item.disabled && item.action) {
                          item.action();
                          setOpenMenu(null);
                        }
                      }}
                      onMouseEnter={(e) => {
                        if (!item.disabled) {
                          e.currentTarget.style.background = 'var(--win-accent)';
                          e.currentTarget.style.color      = '#fff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color      = item.disabled
                          ? 'var(--win-text-muted)'
                          : 'var(--win-text)';
                      }}
                      style={{
                        display:      'flex',
                        alignItems:   'center',
                        gap:          6,
                        width:        '100%',
                        padding:      '5px 14px 5px 8px',
                        background:   'transparent',
                        border:       'none',
                        color:        item.disabled ? 'var(--win-text-muted)' : 'var(--win-text)',
                        cursor:       item.disabled ? 'default' : 'pointer',
                        fontSize:     13,
                        textAlign:    'left',
                        whiteSpace:   'nowrap',
                        borderRadius: 4,
                        margin:       '0 3px',
                        boxSizing:    'border-box',
                      }}
                    >
                      {/* Check-mark column */}
                      <span
                        style={{ width: 14, textAlign: 'center', fontSize: 11, flexShrink: 0 }}
                      >
                        {item.check ? '✓' : ''}
                      </span>
                      {item.label}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Textarea ──────────────────────────────────────────────────────── */}
      <textarea
        ref={taRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        style={{
          flex:         1,
          resize:       'none',
          border:       'none',
          outline:      'none',
          padding:      '8px 10px',
          background:   'var(--win-surface-2)',
          color:        'var(--win-text)',
          fontFamily:   '"Courier New", Courier, monospace',
          fontSize:     FONT_PX[fontSize],
          lineHeight:   1.6,
          whiteSpace:   wordWrap ? 'pre-wrap' : 'pre',
          overflowWrap: wordWrap ? 'break-word' : 'normal',
          overflowX:    wordWrap ? 'hidden' : 'auto',
          overflowY:    'auto',
          width:        '100%',
          boxSizing:    'border-box',
        }}
      />

      {/* ── Status bar ────────────────────────────────────────────────────── */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '3px 10px',
          borderTop:      '1px solid var(--win-border)',
          fontSize:       12,
          color:          'var(--win-text-muted)',
          background:     'var(--win-surface)',
          flexShrink:     0,
          userSelect:     'none',
        }}
      >
        <span>
          {charCount.toLocaleString()} {charCount === 1 ? 'char' : 'chars'}
          {' · '}
          {lineCount} {lineCount === 1 ? 'line' : 'lines'}
        </span>

        {savedFlash && (
          <span style={{ color: 'var(--win-accent)', fontWeight: 600 }}>
            Saved ✓
          </span>
        )}
      </div>
    </div>
  );
}
