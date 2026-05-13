import { motion } from 'framer-motion';
import { useConfig } from '../../context/ConfigContext';

// ── Inline SVG icons ──────────────────────────────────────────────────────────
function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57
        0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695
        -.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99
        .105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225
        -.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405
        c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225
        0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3
        0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853
        0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9
        1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337
        7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063
        2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0
        .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24
        23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401
        6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161
        17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// ── Social link pill button ───────────────────────────────────────────────────
function SocialLink({ href, label, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px]
                 text-white/80 border border-white/10 hover:border-white/25
                 hover:bg-white/10 transition-all duration-150 select-none"
    >
      {icon}
      {label}
    </a>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export function AboutWindow() {  const { config: cfg } = useConfig();
  const name     = cfg.ownerName   || 'Oluwafemi Oyeniran';
  const bio      = cfg.bio         || '';
  const status   = cfg.status      || '';
  const avatar   = cfg.avatarUrl   || '';
  const github   = cfg.socialLinks?.github   || '';
  const linkedin = cfg.socialLinks?.linkedin || '';
  const twitter  = cfg.socialLinks?.twitter  || '';
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 py-6 text-center gap-4">

      {/* Avatar */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1,   opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.25, ease: 'easeOut' }}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover
                       ring-2 ring-white/15 ring-offset-2 ring-offset-transparent"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <div className="w-20 h-20 rounded-full flex items-center justify-center
                          text-white text-2xl font-semibold ring-2 ring-white/15"
            style={{ background: 'var(--win-accent)' }}>
            {name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
          </div>
        )}
      </motion.div>

      {/* Name */}
      <motion.h2
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.2 }}
        className="text-white m-0"
        style={{ fontSize: 24, fontWeight: 500, lineHeight: 1.2 }}
      >
        {name}
      </motion.h2>

      {/* Bio */}
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.2 }}
        className="text-white/55 leading-relaxed m-0"
        style={{
          fontSize: 14,
          maxWidth: 360,
          display:         '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow:        'hidden',
        }}
      >
        {bio}
      </motion.p>

      {/* Status badge */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.2 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full
                   bg-white/5 border border-white/10 text-[12px] text-white/70"
      >
        {/* Pulsing green dot */}
        <span className="relative flex w-2 h-2">
          <span className="animate-ping absolute inline-flex h-full w-full
                           rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full w-2 h-2 bg-green-500" />
        </span>
        <span className="text-white/50 mr-0.5">Currently:</span>
        <span className="text-white/80 font-medium">{status}</span>
      </motion.div>

      {/* Social links */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.2 }}
        className="flex items-center gap-2 mt-1"
      >
        {github   && <SocialLink href={github}   label="GitHub"   icon={<GitHubIcon />}   />}
        {linkedin && <SocialLink href={linkedin} label="LinkedIn" icon={<LinkedInIcon />} />}
        {twitter  && <SocialLink href={twitter}  label="Twitter"  icon={<TwitterIcon />}  />}
      </motion.div>

    </div>
  );
}
