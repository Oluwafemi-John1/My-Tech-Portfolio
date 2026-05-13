import { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';

const API_BASE  = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
const EMAIL_RE  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Inline field component ────────────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-white/55 text-[11px] font-medium uppercase tracking-wide">
        {label}
      </label>
      {children}
      {error && (
        <span className="text-[11px]" style={{ color: '#f87171' }}>
          {error}
        </span>
      )}
    </div>
  );
}

const inputStyle = {
  background:          'rgba(255,255,255,0.07)',
  border:              '1px solid rgba(255,255,255,0.10)',
  borderRadius:        8,
  color:               'rgba(255,255,255,0.85)',
  fontSize:            13,
  padding:             '7px 10px',
  outline:             'none',
  width:               '100%',
  transition:          'border-color 0.15s',
};

const inputErrorStyle = {
  ...inputStyle,
  border: '1px solid rgba(248,113,113,0.6)',
};

// ── Spinner icon ──────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 2a10 10 0 0 1 10 10" opacity="0.3" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

// ── Validation ────────────────────────────────────────────────────────────────
function validate({ name, email, subject, message }) {
  const e = {};
  if (!name.trim())         e.name    = 'Name is required';
  if (!email.trim())        e.email   = 'Email is required';
  else if (!EMAIL_RE.test(email)) e.email = 'Enter a valid email address';
  if (!subject.trim())      e.subject = 'Subject is required';
  if (!message.trim())      e.message = 'Message is required';
  return e;
}

// ── Main component ────────────────────────────────────────────────────────────
export function ContactWindow() {
  const { addNotification } = useNotification();

  const [fields, setFields]   = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors]   = useState({});
  const [sending, setSending] = useState(false);

  const set = (key, val) => {
    setFields((f) => ({ ...f, [key]: val }));
    // Clear the field's error as the user types
    if (errors[key]) setErrors((e) => { const next = { ...e }; delete next[key]; return next; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(fields),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setFields({ name: '', email: '', subject: '', message: '' });
      setErrors({});
      addNotification('Message sent successfully!', 'success');
    } catch {
      addNotification('Failed to send. Try again.', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4"
      style={{ color: 'white' }}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">

        {/* Row: Name + Email */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name" error={errors.name}>
            <input
              type="text"
              value={fields.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Oluwafemi"
              style={errors.name ? inputErrorStyle : inputStyle}
              disabled={sending}
            />
          </Field>

          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={fields.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="you@example.com"
              style={errors.email ? inputErrorStyle : inputStyle}
              disabled={sending}
            />
          </Field>
        </div>

        {/* Subject */}
        <Field label="Subject" error={errors.subject}>
          <input
            type="text"
            value={fields.subject}
            onChange={(e) => set('subject', e.target.value)}
            placeholder="What's this about?"
            style={errors.subject ? inputErrorStyle : inputStyle}
            disabled={sending}
          />
        </Field>

        {/* Message */}
        <Field label="Message" error={errors.message}>
          <textarea
            rows={5}
            value={fields.message}
            onChange={(e) => set('message', e.target.value)}
            placeholder="Write your message here..."
            style={{
              ...(errors.message ? inputErrorStyle : inputStyle),
              resize:    'vertical',
              minHeight: 110,
            }}
            disabled={sending}
          />
        </Field>

        {/* Submit */}
        <button
          type="submit"
          disabled={sending}
          className="flex items-center justify-center gap-2 rounded-lg py-2.5
                     text-white text-[13px] font-medium transition-opacity
                     disabled:opacity-60"
          style={{ background: 'var(--win-accent)' }}
        >
          {sending ? (
            <>
              <Spinner />
              <span>Sending…</span>
            </>
          ) : (
            'Send Message'
          )}
        </button>

      </form>
    </div>
  );
}
