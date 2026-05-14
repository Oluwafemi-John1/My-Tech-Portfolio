import { useState, useEffect } from 'react';

// ── Fake 9×9 QR bitmap ────────────────────────────────────────────────────────
const QR_BITS = [
  1,1,1,0,0,1,1,1,1,
  1,0,1,0,1,0,0,1,0,
  1,1,1,0,0,0,1,0,1,
  0,0,0,1,0,1,0,1,1,
  1,0,1,0,1,0,1,0,1,
  0,1,0,1,0,1,1,0,0,
  1,1,1,0,1,0,1,0,1,
  1,0,1,0,0,1,0,1,1,
  1,1,1,0,1,1,0,0,1,
];

const DURATION_MS  = 3000; // progress fills over 3 s
const RELOAD_MS    = 5000; // page reloads after 5 s

export function BSOD() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();

    const tick = setInterval(() => {
      const pct = Math.min(100, Math.round(((Date.now() - start) / DURATION_MS) * 100));
      setProgress(pct);
      if (pct >= 100) clearInterval(tick);
    }, 50);

    const reload = setTimeout(() => window.location.reload(), RELOAD_MS);

    return () => {
      clearInterval(tick);
      clearTimeout(reload);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 flex flex-col px-[12vw] pt-[14vh] select-none overflow-hidden"
      style={{ background: '#0078D4', zIndex: 9999 }}
    >
      {/* Sad face */}
      <div
        className="text-white font-light mb-8"
        style={{ fontSize: '7rem', lineHeight: 1 }}
      >
        :(
      </div>

      {/* Primary message */}
      <p className="text-white text-[1.45rem] font-light leading-snug max-w-xl mb-6">
        Your portfolio ran into a problem and needs to restart.
      </p>

      {/* Progress */}
      <p className="text-white/75 text-[0.95rem] max-w-xl mb-3">
        We&rsquo;re just collecting some error info, and then we&rsquo;ll restart for you.{' '}
        <span className="text-white font-medium">({progress}% complete)</span>
      </p>

      {/* Stop-code */}
      <p className="text-white/55 text-[0.85rem] mt-4">
        Stop code:{' '}
        <span className="text-white tracking-wide">PORTFOLIO_NOT_FOUND_EXCEPTION</span>
      </p>

      {/* QR placeholder — bottom-right */}
      <div className="absolute bottom-10 right-12 flex flex-col items-end gap-2">
        <div
          className="p-2 rounded-sm"
          style={{ background: 'rgba(255,255,255,0.18)' }}
        >
          <div
            className="grid gap-px"
            style={{ gridTemplateColumns: 'repeat(9, 7px)' }}
          >
            {QR_BITS.map((cell, i) => (
              <div
                key={i}
                style={{
                  width:      7,
                  height:     7,
                  background: cell ? 'rgba(255,255,255,0.88)' : 'transparent',
                }}
              />
            ))}
          </div>
        </div>
        <span className="text-white/45 text-[10px] tracking-wide">
          Scan for more info
        </span>
      </div>
    </div>
  );
}
