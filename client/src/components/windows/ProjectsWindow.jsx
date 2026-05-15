import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

// ── Icons ─────────────────────────────────────────────────────────────────────
function IconGithub() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function IconExternalLink() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function IconImage() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
      strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-white/15">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="m3 9 5-5 4 4 3-3 6 6" />
      <circle cx="8.5" cy="8.5" r="1.5" />
    </svg>
  );
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
      {/* 16:9 thumbnail placeholder */}
      <div className="w-full animate-pulse"
        style={{ paddingTop: '56.25%', background: 'rgba(255,255,255,0.08)' }} />
      <div className="p-3 space-y-2">
        <div className="h-3 rounded animate-pulse"
          style={{ width: '60%', background: 'rgba(255,255,255,0.08)' }} />
        <div className="h-2.5 rounded animate-pulse"
          style={{ width: '90%', background: 'rgba(255,255,255,0.06)' }} />
        <div className="h-2.5 rounded animate-pulse"
          style={{ width: '72%', background: 'rgba(255,255,255,0.06)' }} />
        <div className="flex gap-1.5 pt-1">
          {[42, 56, 48].map((w, i) => (
            <div key={i} className="h-5 rounded-full animate-pulse"
              style={{ width: w, background: 'rgba(255,255,255,0.06)' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Project card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-xl overflow-hidden flex flex-col"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border:     '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* 16:9 thumbnail */}
      <div className="relative w-full shrink-0" style={{ paddingTop: '56.25%' }}>
        {project.thumbnail ? (
          <img
            src={project.thumbnail.startsWith('http') ? project.thumbnail : `${API_BASE}${project.thumbnail}`}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            <IconImage />
          </div>
        )}
        {project.featured && (
          <span className="absolute top-2 left-2 text-white text-[10px] font-semibold
                           px-2 py-0.5 rounded-full"
            style={{ background: 'var(--win-accent)' }}>
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1 gap-1.5">
        <h3 className="text-white/90 font-medium leading-snug" style={{ fontSize: 14 }}>
          {project.title}
        </h3>

        <p className="text-white/50 leading-relaxed flex-1"
          style={{
            fontSize:            12,
            display:             '-webkit-box',
            WebkitLineClamp:     2,
            WebkitBoxOrient:     'vertical',
            overflow:            'hidden',
          }}>
          {project.description}
        </p>

        {/* Tech pills */}
        {project.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {project.techStack.slice(0, 4).map((tech) => (
              <span key={tech} className="text-white/55 text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.08)' }}>
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="text-white/30 text-[10px] self-center">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Action buttons */}
        {(project.githubUrl || project.liveUrl) && (
          <div className="flex items-center gap-3 pt-1 mt-auto">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-white/50 hover:text-white/90
                           transition-colors text-[11px]">
                <IconGithub />
                <span>GitHub</span>
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-white/50 hover:text-white/90
                           transition-colors text-[11px] ml-auto">
                <IconExternalLink />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function ProjectsWindow() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [filter,   setFilter]   = useState('All');

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/projects`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setProjects(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  // Unique tech values derived from loaded data
  const techFilters = ['All', ...new Set(projects.flatMap((p) => p.techStack ?? []))];

  const visible = filter === 'All'
    ? projects
    : projects.filter((p) => p.techStack?.includes(filter));

  return (
    <div className="flex flex-col h-full" style={{ color: 'white' }}>

      {/* ── Filter bar — only shown when data is ready ── */}
      {!loading && !error && projects.length > 0 && (
        <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto shrink-0
                        scrollbar-none"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {techFilters.map((tech) => (
            <button
              key={tech}
              onClick={() => setFilter(tech)}
              className="shrink-0 text-[11px] px-3 py-1 rounded-full transition-colors"
              style={{
                background: filter === tech ? 'var(--win-accent)' : 'rgba(255,255,255,0.07)',
                color:      filter === tech ? '#fff' : 'rgba(255,255,255,0.55)',
              }}
            >
              {tech}
            </button>
          ))}
        </div>
      )}

      {/* ── Scrollable content area ── */}
      <div className="flex-1 overflow-y-auto p-3">

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 gap-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="h-full flex flex-col items-center justify-center gap-3 select-none">
            <p className="text-white/45 text-sm">Could not load projects</p>
            <button
              onClick={fetchProjects}
              className="text-[12px] px-4 py-1.5 rounded-lg border transition-colors
                         hover:text-white/80"
              style={{
                borderColor: 'rgba(255,255,255,0.15)',
                color:       'rgba(255,255,255,0.55)',
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Projects grid */}
        {!loading && !error && (
          visible.length === 0 ? (
            <div className="h-full flex items-center justify-center select-none">
              <p className="text-white/30 text-sm">
                {filter === 'All'
                  ? 'No projects yet.'
                  : `No projects match "${filter}".`}
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-2 gap-3">
                {visible.map((project, i) => (
                  <ProjectCard key={project._id} project={project} index={i} />
                ))}
              </div>
            </AnimatePresence>
          )
        )}
      </div>
    </div>
  );
}
