import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * BootScreen
 * Full-screen black boot splash.
 * After 2500 ms it fades out and calls onComplete().
 *
 * @param {{ onComplete: () => void }} props
 */
export function BootScreen({ onComplete }) {
  useEffect(() => {
    const id = setTimeout(onComplete, 2500);
    return () => clearTimeout(id);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
    >
      {/* Windows logo — 4-pane coloured square built with divs */}
      <div className="grid grid-cols-2 gap-[3px] w-16 h-16">
        <div className="rounded-sm" style={{ background: '#F25022' }} /> {/* red   */}
        <div className="rounded-sm" style={{ background: '#7FBA00' }} /> {/* green */}
        <div className="rounded-sm" style={{ background: '#00A4EF' }} /> {/* blue  */}
        <div className="rounded-sm" style={{ background: '#FFB900' }} /> {/* yellow*/}
      </div>

      {/* Spinning ring loader */}
      <div className="mt-16 w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
    </motion.div>
  );
}
