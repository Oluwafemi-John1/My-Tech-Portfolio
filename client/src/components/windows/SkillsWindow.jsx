import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Local data — replaced with API call in Phase 3 ────────────────────────────
const skills = [
  { name: 'React',      category: 'Frontend', level: 90 },
  { name: 'Angular',    category: 'Frontend', level: 80 },
  { name: 'Vue',        category: 'Frontend', level: 60 },
  { name: 'TypeScript', category: 'Frontend', level: 80 },
  { name: 'Node.js',    category: 'Backend',  level: 85 },
  { name: 'MongoDB',    category: 'Backend',  level: 75 },
  { name: 'PHP',        category: 'Backend',  level: 65 },
  { name: 'Laravel',    category: 'Backend',  level: 55 },
  { name: 'Docker',     category: 'DevOps',   level: 60 },
  { name: 'CPanel',     category: 'DevOps',   level: 80 },
  { name: 'Git',        category: 'Tools',    level: 95 },
  { name: 'GitHub',     category: 'Tools',    level: 90 },
  { name: 'Figma',      category: 'Tools',    level: 70 },
];

const FILTERS   = ['All', 'Frontend', 'Backend', 'DevOps', 'Tools'];

const BAR_COLOR = {
  Frontend: '#3b82f6',
  Backend:  '#22c55e',
  DevOps:   '#f97316',
  Tools:    '#94a3b8',
};

const FILTER_ACTIVE_COLOR = {
  All:      '#0078D4',
  Frontend: '#3b82f6',
  Backend:  '#22c55e',
  DevOps:   '#f97316',
  Tools:    '#94a3b8',
};

// ── Sub-components ────────────────────────────────────────────────────────────
function SkillRow({ skill, index, filterKey }) {
  const color = BAR_COLOR[skill.category];

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, delay: index * 0.035 }}
      className="flex items-center gap-3 py-1.5"
    >
      {/* Skill name */}
      <span
        className="text-white/80 text-[12px] shrink-0 text-right"
        style={{ width: 88 }}
      >
        {skill.name}
      </span>

      {/* Track */}
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden relative">
        {/* Animated fill — key forces re-animation when filter changes */}
        <motion.div
          key={`${skill.name}-${filterKey}`}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${skill.level}%` }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: index * 0.04 }}
        />
      </div>

      {/* Level label */}
      <span className="text-white/40 text-[11px] tabular-nums shrink-0" style={{ width: 28 }}>
        {skill.level}%
      </span>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function SkillsWindow() {
  const [active, setActive] = useState('All');

  const filtered = active === 'All'
    ? skills
    : skills.filter((s) => s.category === active);

  const activeColor = FILTER_ACTIVE_COLOR[active];

  return (
    <div className="flex flex-col h-full select-none">

      {/* ── Filter tabs ── */}
      <div className="flex items-center gap-1.5 px-4 pt-3 pb-2 shrink-0">
        {FILTERS.map((f) => {
          const isActive = f === active;
          return (
            <button
              key={f}
              onClick={() => setActive(f)}
              className="px-3 py-1 rounded-full text-[11px] font-medium transition-all duration-150"
              style={{
                background:  isActive ? activeColor          : 'rgba(255,255,255,0.06)',
                color:       isActive ? '#fff'               : 'rgba(255,255,255,0.55)',
                border:      isActive ? `1px solid ${activeColor}` : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {f}
            </button>
          );
        })}

        {/* Skill count badge */}
        <span className="ml-auto text-[11px] text-white/30 tabular-nums">
          {filtered.length} skill{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/8 mx-4 shrink-0" />

      {/* ── Skill list (scrollable) ── */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((skill, i) => (
            <SkillRow
              key={skill.name}
              skill={skill}
              index={i}
              filterKey={active}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
