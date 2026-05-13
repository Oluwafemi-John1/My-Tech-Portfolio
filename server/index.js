require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const connectDB      = require('./config/db');
const projectsRouter = require('./routes/projects');
const skillsRouter   = require('./routes/skills');
const contactRouter  = require('./routes/contact');
const configRouter   = require('./routes/config');
const authRouter     = require('./routes/auth');

const app = express();

// ── Database ──────────────────────────────────────────────────────────────────
connectDB();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/projects', projectsRouter);
app.use('/api/skills',   skillsRouter);
app.use('/api/contact',  contactRouter);
app.use('/api/config',   configRouter);
app.use('/api/auth',     authRouter);

// Health check
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() }),
);

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
