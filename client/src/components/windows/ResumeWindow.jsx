import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Local resume data — replaced with API call in Phase 3 ─────────────────────
const resumeData = {
  experience: [
    {
      id: 'e1',
      role:    'Frontend Developer',
      company: 'Acme Corp',
      period:  'Jan 2024 – Present',
      bullets: [
        'Architected a React micro-frontend platform serving 200k+ monthly users.',
        'Reduced bundle size by 38 % through code-splitting and lazy loading.',
        'Led migration from CRA to Vite, cutting cold-start dev time by 4×.',
      ],
    },
    {
      id: 'e2',
      role:    'Junior Full-Stack Developer',
      company: 'StartupXYZ',
      period:  'Jun 2022 – Dec 2023',
      bullets: [
        'Built REST APIs in Node.js/Express consumed by web and mobile clients.',
        'Designed MongoDB schemas and optimised slow queries by up to 60 %.',
        'Shipped a Laravel-based CMS portal for 12 enterprise clients.',
      ],
    },
    {
      id: 'e3',
      role:    'Freelance Web Developer',
      company: 'Self-employed',
      period:  'Jan 2021 – May 2022',
      bullets: [
        'Delivered 20+ responsive websites for SMBs across various industries.',
        'Introduced version control workflows and CI/CD pipelines for clients.',
      ],
    },
  ],
  education: [
    {
      id: 'ed1',
      role:    'BSc Computer Science',
      company: 'University of Lagos',
      period:  '2018 – 2022',
      bullets: [
        'Graduated with Second Class Upper (2:1), GPA 4.2/5.0.',
        'Thesis: "Real-time Collaborative Editing with CRDTs in the Browser".',
      ],
    },
    {
      id: 'ed2',
      role:    'Full-Stack Web Development Bootcamp',
      company: 'Andela Learning Community',
      period:  '2020',
      bullets: [
        'Intensive 6-month programme covering React, Node.js and cloud deployment.',
      ],
    },
  ],
};

// ── Icons ─────────────────────────────────────────────────────────────────────
function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function TimelineIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6"  x2="21" y2="6"  />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6"  x2="3.01" y2="6"  />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

// ── Timeline entry ────────────────────────────────────────────────────────────
function TimelineEntry({ entry, index, isLast }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="relative flex gap-4 pb-6"
    >
      {/* Vertical line + dot */}
      <div className="relative flex flex-col items-center" style={{ width: 16 }}>
        {/* Dot */}
        <div className="w-3 h-3 rounded-full border-2 border-[#0078D4] bg-[rgba(32,32,32,0.92)]
                        shrink-0 mt-1 z-10" />
        {/* Connector */}
        {!isLast && (
          <div className="flex-1 w-px bg-white/10 mt-1" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-1">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <span className="text-white/90 text-[13px] font-medium leading-tight">
            {entry.role}
          </span>
          <span className="text-white/35 text-[11px] shrink-0 tabular-nums">
            {entry.period}
          </span>
        </div>
        <span className="text-[#0078D4] text-[11px] font-medium">{entry.company}</span>

        <ul className="mt-1.5 space-y-1">
          {entry.bullets.map((b, i) => (
            <li key={i} className="flex gap-2 text-white/50 text-[11px] leading-relaxed">
              <span className="text-white/25 shrink-0 mt-px">›</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ label }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">
        {label}
      </span>
      <div className="flex-1 h-px bg-white/8" />
    </div>
  );
}

// ── PDF view ──────────────────────────────────────────────────────────────────
function PdfView() {
  const [missing, setMissing] = useState(false);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {missing ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-white/30">
          <PdfIcon />
          <span className="text-[12px]">resume.pdf not found in /public</span>
        </div>
      ) : (
        <iframe
          src="/resume.pdf"
          title="Resume PDF"
          className="flex-1 w-full border-0"
          onError={() => setMissing(true)}
        />
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function ResumeWindow() {
  const [mode, setMode] = useState('timeline'); // 'timeline' | 'pdf'

  const allEntries = [
    ...resumeData.experience,
    ...resumeData.education,
  ];

  return (
    <div className="flex flex-col h-full select-none">

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2 shrink-0">
        {/* View toggles */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/5 border border-white/8">
          {[
            { id: 'timeline', Icon: TimelineIcon, label: 'Timeline' },
            { id: 'pdf',      Icon: PdfIcon,      label: 'PDF'      },
          ].map(({ id, Icon, label }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px]
                         font-medium transition-all duration-150"
              style={{
                background: mode === id ? 'rgba(255,255,255,0.12)' : 'transparent',
                color:      mode === id ? '#fff'                   : 'rgba(255,255,255,0.4)',
              }}
            >
              <Icon />
              {label}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Download button */}
        <a
          href="/resume.pdf"
          download="Oluwafemi_Oyeniran_Resume.pdf"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px]
                     font-medium text-white/80 border border-white/10
                     hover:bg-white/10 hover:border-white/20 transition-all duration-150"
        >
          <DownloadIcon />
          Download
        </a>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/8 mx-4 shrink-0" />

      {/* ── Content ── */}
      <AnimatePresence mode="wait">
        {mode === 'timeline' ? (
          <motion.div
            key="timeline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1 overflow-y-auto px-5 py-4"
          >
            <SectionHeading label="Experience" />
            {resumeData.experience.map((e, i) => (
              <TimelineEntry
                key={e.id}
                entry={e}
                index={i}
                isLast={i === resumeData.experience.length - 1}
              />
            ))}

            <SectionHeading label="Education" />
            {resumeData.education.map((e, i) => (
              <TimelineEntry
                key={e.id}
                entry={e}
                index={resumeData.experience.length + i}
                isLast={i === resumeData.education.length - 1}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="pdf"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <PdfView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
