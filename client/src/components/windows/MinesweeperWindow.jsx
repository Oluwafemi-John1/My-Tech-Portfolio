/**
 * MinesweeperWindow — classic beginner Minesweeper (9×9, 10 mines).
 * Self-contained: no external libraries, no imports beyond React.
 *
 * Rules implemented:
 *  - First-click safety: mines are placed AFTER the first click, skipping
 *    the clicked cell so it can never be a mine.
 *  - Left-click reveals a cell; empty cells (neighborCount === 0) trigger
 *    a flood-fill that reveals all connected empty/numbered cells.
 *  - Right-click toggles a flag on an unrevealed cell.
 *  - Win when every non-mine cell is revealed.
 *  - Loss when a mine cell is revealed; all mines are shown.
 */

import { useState, useEffect, useRef } from 'react';

// ── Constants ─────────────────────────────────────────────────────────────────
const ROWS  = 9;
const COLS  = 9;
const MINES = 10;
const CELL  = 28; // px per cell

// Classic Minesweeper number palette
const NUM_COLOR = [
  '',        // 0 – blank
  '#0000ff', // 1 – blue
  '#007b00', // 2 – green
  '#ff0000', // 3 – red
  '#00007b', // 4 – dark blue
  '#7b0000', // 5 – maroon
  '#007b7b', // 6 – teal
  '#000000', // 7 – black
  '#7b7b7b', // 8 – grey
];

// ── Grid helpers ──────────────────────────────────────────────────────────────
function emptyCell() {
  return {
    isMine:        false,
    isRevealed:    false,
    isFlagged:     false,
    neighborCount: 0,
    isClickedMine: false, // the specific mine the player detonated
  };
}

function emptyGrid() {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, emptyCell),
  );
}

/**
 * Returns a new grid with MINES mines placed randomly, guaranteed NOT on
 * (safeR, safeC). Neighbor counts are calculated at the same time.
 */
function withMines(grid, safeR, safeC) {
  const g = grid.map(r => r.map(c => ({ ...c })));
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (g[r][c].isMine || (r === safeR && c === safeC)) continue;
    g[r][c].isMine = true;
    placed++;
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (g[r][c].isMine) continue;
      let n = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && g[nr][nc].isMine) n++;
        }
      g[r][c].neighborCount = n;
    }
  }
  return g;
}

/**
 * Flood-fill reveal starting at (startR, startC).
 * Reveals the start cell plus every connected empty cell and the numbered
 * border around each empty region.
 */
function floodReveal(grid, startR, startC) {
  const g       = grid.map(r => r.map(c => ({ ...c })));
  const visited = new Set();
  const stack   = [[startR, startC]];

  while (stack.length) {
    const [r, c] = stack.pop();
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;
    const key = r * COLS + c;
    if (visited.has(key)) continue;
    visited.add(key);

    const cell = g[r][c];
    if (cell.isFlagged || cell.isMine || cell.isRevealed) continue;
    cell.isRevealed = true;

    // Propagate through zero-count cells only
    if (cell.neighborCount === 0) {
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++)
          if (dr !== 0 || dc !== 0) stack.push([r + dr, c + dc]);
    }
  }
  return g;
}

/** True when every non-mine cell has been revealed. */
function isWon(grid) {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (!grid[r][c].isMine && !grid[r][c].isRevealed) return false;
  return true;
}

// ── LCD-style display (red digits on black) ───────────────────────────────────
function LcdDisplay({ value }) {
  return (
    <div
      style={{
        background:  '#000',
        color:       '#ff0000',
        fontFamily:  '"Courier New", Courier, monospace',
        fontSize:    20,
        fontWeight:  'bold',
        minWidth:    42,
        padding:     '1px 5px',
        textAlign:   'right',
        letterSpacing: 2,
        border:      '1px solid #808080',
        userSelect:  'none',
      }}
    >
      {value}
    </div>
  );
}

// ── Single board cell ─────────────────────────────────────────────────────────
function Cell({ cell, gameState, onClick, onContextMenu }) {
  const { isMine, isRevealed, isFlagged, neighborCount, isClickedMine } = cell;
  const lost = gameState === 'lost';
  const over = gameState === 'won' || gameState === 'lost';

  // Default: unrevealed raised button (Win95 style)
  let bg          = '#c0c0c0';
  let border      = '3px solid';
  let borderColor = '#ffffff #808080 #808080 #ffffff'; // top-left light, bottom-right dark
  let content     = null;
  let fontColor   = 'inherit';
  let fontSize    = 14;

  if (isRevealed) {
    // Flat inset look for revealed cells
    border      = '1px solid';
    borderColor = '#808080 #ffffff #ffffff #808080';
    bg          = '#bdbdbd';

    if (isMine) {
      bg      = isClickedMine ? '#ff0000' : '#ff7777';
      content = '💣';
      fontSize = 16;
    } else if (neighborCount > 0) {
      fontColor = NUM_COLOR[neighborCount];
      content   = neighborCount;
      fontSize  = 14;
    }
  } else if (isFlagged) {
    if (lost && !isMine) {
      // Incorrect flag — mine was NOT here
      bg      = '#ffcccc';
      content = '❌';
      fontSize = 12;
    } else {
      content  = '🚩';
      fontSize = 16;
    }
  } else if (lost && isMine) {
    // Unrevealed mine exposed at game-over
    content  = '💣';
    fontSize = 16;
  }

  return (
    <div
      onClick={over ? undefined : onClick}
      onContextMenu={over ? (e) => e.preventDefault() : onContextMenu}
      style={{
        width:          CELL,
        height:         CELL,
        background:     bg,
        border,
        borderColor,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        boxSizing:      'border-box',
        cursor:         over ? 'default' : 'pointer',
        flexShrink:     0,
        fontSize,
        fontWeight:     'bold',
        color:          fontColor,
        userSelect:     'none',
        WebkitUserSelect: 'none',
      }}
    >
      {content}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function MinesweeperWindow() {
  const [grid,      setGrid]      = useState(emptyGrid);
  const [gameState, setGameState] = useState('idle'); // idle | playing | won | lost
  const [flags,     setFlags]     = useState(0);
  const [seconds,   setSeconds]   = useState(0);
  const timerRef = useRef(null);

  // Start the ticker when playing; stop it on any terminal state
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(
        () => setSeconds(s => Math.min(s + 1, 999)),
        1000,
      );
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  // ── Actions ──────────────────────────────────────────────────────────────
  function reset() {
    clearInterval(timerRef.current);
    setGrid(emptyGrid());
    setGameState('idle');
    setFlags(0);
    setSeconds(0);
  }

  function handleClick(r, c) {
    if (gameState === 'won' || gameState === 'lost') return;
    const cell = grid[r][c];
    if (cell.isRevealed || cell.isFlagged) return;

    // First click: lay mines guaranteeing (r,c) is safe
    let g = grid;
    if (gameState === 'idle') {
      g = withMines(grid, r, c);
      // gameState will be set below — effect starts timer on 'playing'
    }

    if (g[r][c].isMine) {
      // Detonate: reveal every mine, mark the one that was clicked
      const lost = g.map((row, ri) =>
        row.map((cl, ci) => ({
          ...cl,
          isRevealed:    cl.isMine    ? true : cl.isRevealed,
          isClickedMine: ri === r && ci === c,
        })),
      );
      setGrid(lost);
      setGameState('lost');
      return;
    }

    const revealed = floodReveal(g, r, c);
    const won      = isWon(revealed);

    // On win: auto-flag every remaining mine for visual confirmation
    const final = won
      ? revealed.map(row =>
          row.map(cl => (!cl.isFlagged && cl.isMine ? { ...cl, isFlagged: true } : cl)),
        )
      : revealed;

    setGrid(final);
    setGameState(won ? 'won' : 'playing');
  }

  function handleRightClick(e, r, c) {
    e.preventDefault();
    if (gameState === 'won' || gameState === 'lost') return;
    const cell = grid[r][c];
    if (cell.isRevealed) return;

    const next = grid.map(row => row.map(cl => ({ ...cl })));
    const wasFlagged = next[r][c].isFlagged;
    next[r][c].isFlagged = !wasFlagged;
    setFlags(f => (wasFlagged ? f - 1 : f + 1));
    setGrid(next);
  }

  // ── Display values ────────────────────────────────────────────────────────
  const remaining = MINES - flags;
  const minesDisplay =
    remaining < 0
      ? '-' + String(Math.min(99, -remaining)).padStart(2, '0')
      : String(Math.min(999, remaining)).padStart(3, '0');
  const timerDisplay = String(seconds).padStart(3, '0');
  const smiley = gameState === 'won' ? '😎' : gameState === 'lost' ? '😵' : '🙂';

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        padding:        10,
        background:     '#c0c0c0',
        height:         '100%',
        boxSizing:      'border-box',
        userSelect:     'none',
      }}
    >
      {/* ── Header bar ─────────────────────────────────────────────────── */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          width:          '100%',
          padding:        '4px 8px',
          marginBottom:   8,
          background:     '#c0c0c0',
          border:         '3px solid',
          borderColor:    '#ffffff #808080 #808080 #ffffff',
          boxSizing:      'border-box',
        }}
      >
        <LcdDisplay value={minesDisplay} />

        <button
          onClick={reset}
          title="New game"
          style={{
            fontSize:       18,
            width:          32,
            height:         26,
            padding:        0,
            cursor:         'pointer',
            background:     '#c0c0c0',
            border:         '2px solid',
            borderColor:    '#ffffff #808080 #808080 #ffffff',
            lineHeight:     1,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
          }}
        >
          {smiley}
        </button>

        <LcdDisplay value={timerDisplay} />
      </div>

      {/* ── Minefield grid ─────────────────────────────────────────────── */}
      <div
        style={{
          border:         '3px solid',
          borderColor:    '#808080 #ffffff #ffffff #808080',
          display:        'inline-flex',
          flexDirection:  'column',
          flexShrink:     0,
        }}
      >
        {grid.map((row, r) => (
          <div key={r} style={{ display: 'flex' }}>
            {row.map((cell, c) => (
              <Cell
                key={c}
                cell={cell}
                gameState={gameState}
                onClick={() => handleClick(r, c)}
                onContextMenu={(e) => handleRightClick(e, r, c)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
