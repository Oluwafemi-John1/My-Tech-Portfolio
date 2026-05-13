import { motion } from 'framer-motion';
import { useClock } from '../../hooks/useClock';

/**
 * LockScreen
 * Full-screen lock UI with live clock.
 * Click anywhere to animate the screen off the top and call onUnlock().
 *
 * @param {{ onUnlock: () => void }} props
 */
export function LockScreen({ onUnlock }) {
  const { time, date } = useClock();

  return (
    <motion.div
      className="fixed inset-0 z-[900] flex flex-col items-center justify-between py-20 cursor-pointer select-none"
      style={{
        background:
          'radial-gradient(ellipse at 50% 30%, #0a2a6e 0%, #050d1f 70%, #000 100%)',
      }}
      initial={{ y: 0, opacity: 1 }}
      exit={{
        y: '-100vh',
        opacity: 0,
        transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
      }}
      onClick={onUnlock}
    >
      {/* Top spacer */}
      <div />

      {/* Clock block — centered vertically */}
      <div className="flex flex-col items-center gap-2">
        <span
          className="text-white leading-none tracking-tight"
          style={{ fontSize: '72px', fontWeight: 200 }}
        >
          {time}
        </span>
        <span className="text-white/70 text-xl font-light tracking-wide">
          {date}
        </span>
      </div>

      {/* Bottom hint — pulsing opacity */}
      <motion.span
        className="text-white/40 text-sm tracking-widest uppercase"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        Click anywhere to continue
      </motion.span>
    </motion.div>
  );
}
