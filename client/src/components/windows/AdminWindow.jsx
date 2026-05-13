import { useState, useEffect, useCallback } from 'react';

const API_BASE  = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
const TOKEN_KEY = 'admin_token';

// ── Auth helpers ──────────────────────────────────────────────────────────────
const getToken    = ()  => localStorage.getItem(TOKEN_KEY);
const storeToken  = (t) => localStorage.setItem(TOKEN_KEY, t);
const deleteToken = ()  => localStorage.removeItem(TOKEN_KEY);

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization:  `Bearer ${getToken()}`,
  };
}

// ── Shared UI primitives ──────────────────────────────────────────────────────
const inputCls = `w-full rounded-lg px-2.5 py-1.5 text-[12px] text-white/85
  border border-white/10 focus:border-white/30 focus:outline-none transition-colors`;
const inputBg  = { background: 'rgba(255,255,255,0.06)' };

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-white/45 text-[10px] uppercase tracking-wide">{label}</span>}
      <input className={inputCls} style={inputBg} {...props} />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-white/45 text-[10px] uppercase tracking-wide">{label}</span>}
      <textarea className={inputCls} style={{ ...inputBg, resize: 'vertical', minHeight: 64 }}
        {...props} />
    </div>
  );
}

function Btn({ children, variant = 'default', className = '', ...props }) {
  const base = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors disabled:opacity-50';
  const vars = {
    default:  'bg-white/8  hover:bg-white/14 text-white/70',
    primary:  'text-white',
    danger:   'bg-red-500/15 hover:bg-red-500/25 text-red-400',
  };
  return (
    <button className={`${base} ${vars[variant]} ${className}`}
      style={variant === 'primary' ? { background: 'var(--win-accent)' } : undefined}
      {...props}>
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

// ── Login panel ───────────────────────────────────────────────────────────────
function LoginPanel({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const { token } = await res.json();
      storeToken(token);
      onLogin(token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-8">
      <div className="flex items-center gap-2 mb-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white/40">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span className="text-white/60 text-[13px] font-medium">Admin Access</span>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3 w-full max-w-[260px]">
        <Input label="Username" type="text" value={username}
          onChange={(e) => setUsername(e.target.value)} placeholder="admin" autoFocus />
        <Input label="Password" type="password" value={password}
          onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />

        {error && <p className="text-red-400 text-[11px] text-center">{error}</p>}

        <Btn type="submit" variant="primary" disabled={loading} className="justify-center mt-1">
          {loading ? <><Spinner /> Signing in…</> : 'Sign In'}
        </Btn>
      </form>
    </div>
  );
}

// ── Project modal ─────────────────────────────────────────────────────────────
const EMPTY_PROJ = { title: '', description: '', techStack: '', githubUrl: '', liveUrl: '', thumbnail: '', featured: false };

function ProjectModal({ project, onClose, onSaved }) {
  const isEdit = !!project?._id;
  const [form,    setForm]    = useState(
    project ? { ...project, techStack: (project.techStack ?? []).join(', ') } : EMPTY_PROJ,
  );
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }
    setSaving(true);
    setError('');
    try {
      const body = {
        ...form,
        techStack: form.techStack.split(',').map((s) => s.trim()).filter(Boolean),
        featured:  !!form.featured,
      };
      const url    = isEdit ? `${API_BASE}/api/projects/${project._id}` : `${API_BASE}/api/projects`;
      const method = isEdit ? 'PUT' : 'POST';
      const res    = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || `HTTP ${res.status}`);
      }
      onSaved(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    // Full-window overlay within the WindowFrame's coordinate space
    <div className="absolute inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md rounded-xl p-4 flex flex-col gap-3 shadow-2xl"
        style={{ background: 'rgba(28,28,32,0.97)', border: '1px solid rgba(255,255,255,0.10)' }}>

        <div className="flex items-center justify-between">
          <span className="text-white/80 text-[13px] font-medium">
            {isEdit ? 'Edit Project' : 'Add Project'}
          </span>
          <button onClick={onClose} className="text-white/35 hover:text-white/70 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={save} className="flex flex-col gap-2.5 overflow-y-auto max-h-[360px] pr-1">
          <Input label="Title *" value={form.title} onChange={(e) => set('title', e.target.value)} />
          <Textarea label="Description" value={form.description}
            onChange={(e) => set('description', e.target.value)} />
          <Input label="Tech Stack (comma-separated)" value={form.techStack}
            onChange={(e) => set('techStack', e.target.value)} placeholder="React, Node.js, MongoDB" />
          <Input label="GitHub URL" value={form.githubUrl}
            onChange={(e) => set('githubUrl', e.target.value)} />
          <Input label="Live URL" value={form.liveUrl}
            onChange={(e) => set('liveUrl', e.target.value)} />
          <Input label="Thumbnail URL" value={form.thumbnail}
            onChange={(e) => set('thumbnail', e.target.value)} />

          <label className="flex items-center gap-2 text-white/55 text-[12px] cursor-pointer">
            <input type="checkbox" checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
              className="accent-blue-500 w-3.5 h-3.5" />
            Featured project
          </label>

          {error && <p className="text-red-400 text-[11px]">{error}</p>}

          <div className="flex gap-2 pt-1">
            <Btn type="submit" variant="primary" disabled={saving}>
              {saving ? <><Spinner /> Saving…</> : 'Save'}
            </Btn>
            <Btn type="button" onClick={onClose}>Cancel</Btn>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Projects tab ──────────────────────────────────────────────────────────────
function ProjectsTab() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(null); // null | 'add' | projectObj

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/projects`);
      setProjects(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSaved = (saved) => {
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p._id === saved._id);
      return idx >= 0 ? prev.map((p) => (p._id === saved._id ? saved : p)) : [saved, ...prev];
    });
    setModal(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    const res = await fetch(`${API_BASE}/api/projects/${id}`, {
      method: 'DELETE', headers: authHeaders(),
    });
    if (res.ok) setProjects((p) => p.filter((x) => x._id !== id));
  };

  return (
    <div className="flex flex-col h-full relative">
      {modal && (
        <ProjectModal
          project={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      <div className="flex items-center justify-between px-3 py-2 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <span className="text-white/50 text-[11px]">{projects.length} project{projects.length !== 1 ? 's' : ''}</span>
        <Btn variant="primary" onClick={() => setModal('add')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" className="w-3.5 h-3.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Project
        </Btn>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/30 text-[12px]">No projects yet.</p>
          </div>
        ) : (
          <table className="w-full text-[11px]">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['Title', 'Tech Stack', 'Featured', ''].map((h) => (
                  <th key={h} className="text-left text-white/35 font-normal px-3 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id} className="hover:bg-white/4 transition-colors"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td className="px-3 py-2 text-white/75 max-w-[160px] truncate">{p.title}</td>
                  <td className="px-3 py-2 text-white/45 max-w-[180px] truncate">
                    {(p.techStack ?? []).slice(0, 3).join(', ')}
                    {(p.techStack?.length ?? 0) > 3 ? '…' : ''}
                  </td>
                  <td className="px-3 py-2">
                    {p.featured && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full text-white"
                        style={{ background: 'var(--win-accent)' }}>✦</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <Btn onClick={() => setModal(p)}>Edit</Btn>
                      <Btn variant="danger" onClick={() => handleDelete(p._id)}>Delete</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Config tab ────────────────────────────────────────────────────────────────
function ConfigTab() {
  const [form,    setForm]    = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/api/config`)
      .then((r) => r.json())
      .then((d) => setForm({
        ownerName: d.ownerName ?? '',
        bio:       d.bio       ?? '',
        status:    d.status    ?? '',
        avatarUrl: d.avatarUrl ?? '',
        wallpaper: d.wallpaper ?? '',
        github:    d.socialLinks?.github   ?? '',
        linkedin:  d.socialLinks?.linkedin ?? '',
        twitter:   d.socialLinks?.twitter  ?? '',
      }))
      .catch(() => {});
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const body = {
        ownerName: form.ownerName,
        bio:       form.bio,
        status:    form.status,
        avatarUrl: form.avatarUrl,
        wallpaper: form.wallpaper,
        socialLinks: { github: form.github, linkedin: form.linkedin, twitter: form.twitter },
      };
      const res = await fetch(`${API_BASE}/api/config`, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMessage('Saved!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!form) return (
    <div className="flex items-center justify-center h-full"><Spinner /></div>
  );

  return (
    <form onSubmit={save} className="flex flex-col gap-3 p-3 overflow-y-auto h-full">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Owner Name" value={form.ownerName} onChange={(e) => set('ownerName', e.target.value)} />
        <Input label="Status"     value={form.status}    onChange={(e) => set('status',    e.target.value)} />
      </div>
      <Textarea label="Bio" value={form.bio} onChange={(e) => set('bio', e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Avatar URL"   value={form.avatarUrl} onChange={(e) => set('avatarUrl', e.target.value)} />
        <Input label="Wallpaper URL" value={form.wallpaper} onChange={(e) => set('wallpaper', e.target.value)} />
      </div>
      <div className="text-white/35 text-[10px] uppercase tracking-wide pt-1">Social Links</div>
      <div className="grid grid-cols-3 gap-3">
        <Input label="GitHub"   value={form.github}   onChange={(e) => set('github',   e.target.value)} />
        <Input label="LinkedIn" value={form.linkedin} onChange={(e) => set('linkedin', e.target.value)} />
        <Input label="Twitter"  value={form.twitter}  onChange={(e) => set('twitter',  e.target.value)} />
      </div>
      <div className="flex items-center gap-3 pt-1">
        <Btn type="submit" variant="primary" disabled={saving}>
          {saving ? <><Spinner /> Saving…</> : 'Save Config'}
        </Btn>
        {message && (
          <span className={`text-[11px] ${message === 'Saved!' ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </span>
        )}
      </div>
    </form>
  );
}

// ── Messages tab ──────────────────────────────────────────────────────────────
function MessagesTab() {
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/contact`, { headers: authHeaders() })
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then(setMessages)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full"><Spinner /></div>
  );

  if (messages.length === 0) return (
    <div className="flex items-center justify-center h-full">
      <p className="text-white/30 text-[12px]">No messages yet.</p>
    </div>
  );

  return (
    <div className="overflow-y-auto h-full">
      <table className="w-full text-[11px]">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            {['Name', 'Email', 'Subject', 'Date', ''].map((h) => (
              <th key={h} className="text-left text-white/35 font-normal px-3 py-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {messages.map((m) => (
            <tr key={m._id}
              className={`hover:bg-white/4 transition-colors ${!m.read ? 'text-white/80' : 'text-white/45'}`}
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td className="px-3 py-2 max-w-[100px] truncate">{m.name}</td>
              <td className="px-3 py-2 max-w-[140px] truncate text-white/45">{m.email}</td>
              <td className="px-3 py-2 max-w-[140px] truncate">{m.subject}</td>
              <td className="px-3 py-2 text-white/35 whitespace-nowrap">
                {new Date(m.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
              </td>
              <td className="px-3 py-2">
                {!m.read && (
                  <span className="w-2 h-2 rounded-full inline-block"
                    style={{ background: 'var(--win-accent)' }} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Tab definitions ───────────────────────────────────────────────────────────
const TABS = [
  { id: 'projects', label: 'Projects' },
  { id: 'config',   label: 'Config'   },
  { id: 'messages', label: 'Messages' },
];

// ── Main admin window ─────────────────────────────────────────────────────────
export function AdminWindow() {
  const [token,     setTokenState] = useState(() => getToken());
  const [activeTab, setActiveTab]  = useState('projects');

  const handleLogin = (t) => setTokenState(t);
  const handleLogout = () => { deleteToken(); setTokenState(null); };

  if (!token) return <LoginPanel onLogin={handleLogin} />;

  return (
    <div className="flex flex-col h-full" style={{ color: 'white' }}>
      {/* Tab bar + logout */}
      <div className="flex items-center justify-between shrink-0 px-2"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', minHeight: 38 }}>
        <div className="flex items-center gap-0.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-3 py-1.5 text-[12px] rounded-lg transition-colors"
              style={{
                background: activeTab === tab.id ? 'rgba(255,255,255,0.10)' : 'transparent',
                color:      activeTab === tab.id ? 'rgba(255,255,255,0.90)' : 'rgba(255,255,255,0.40)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="text-white/30 hover:text-white/60 text-[11px] px-2 py-1 transition-colors"
          title="Sign out"
        >
          Sign out
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 relative">
        {activeTab === 'projects' && <ProjectsTab />}
        {activeTab === 'config'   && <ConfigTab   />}
        {activeTab === 'messages' && <MessagesTab />}
      </div>
    </div>
  );
}
