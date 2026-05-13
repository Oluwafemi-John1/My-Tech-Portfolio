/**
 * seed.js — populate the portfolio database with sample data.
 *
 * Usage (from /server):
 *   node seed.js
 *
 * Requires a .env file with MONGO_URI and DB_NAME set.
 */

require('dotenv').config();
const mongoose = require('mongoose');

const Project = require('./models/Project');
const Skill   = require('./models/Skill');
const Config  = require('./models/Config');

// ── Sample data ───────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    title:       'Win11 Portfolio',
    description: 'A fully interactive Windows 11-themed developer portfolio built with React, Vite, and Framer Motion. Features draggable windows, a start menu, boot/lock screens, and dynamic theming.',
    techStack:   ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Node.js', 'MongoDB'],
    githubUrl:   'https://github.com/Oluwafemi-John1/My-Tech-Portfolio',
    liveUrl:     '',
    featured:    true,
  },
  {
    title:       'E-Commerce REST API',
    description: 'Production-ready REST API for an e-commerce platform. Includes JWT auth, product catalogue, cart management, order processing, and Stripe payment integration.',
    techStack:   ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'Stripe', 'JWT'],
    githubUrl:   'https://github.com',
    liveUrl:     '',
    featured:    false,
  },
  {
    title:       'Admin Dashboard',
    description: 'Full-stack admin panel with role-based access control, real-time analytics charts, user management, and a responsive data-table with server-side pagination.',
    techStack:   ['Angular', 'TypeScript', 'Laravel', 'MySQL', 'Chart.js'],
    githubUrl:   'https://github.com',
    liveUrl:     '',
    featured:    false,
  },
  {
    title:       'Real-time Chat App',
    description: 'Peer-to-peer and group chat application with message persistence, read receipts, typing indicators, and file sharing via WebSockets and Socket.io.',
    techStack:   ['React', 'Socket.io', 'Node.js', 'MongoDB', 'Redis'],
    githubUrl:   'https://github.com',
    liveUrl:     '',
    featured:    true,
  },
  {
    title:       'CI/CD Pipeline Boilerplate',
    description: 'A reusable GitHub Actions workflow for Node.js applications: lint → test → Docker build → push to GHCR → deploy to a self-hosted server via SSH.',
    techStack:   ['GitHub Actions', 'Docker', 'Node.js', 'Jest', 'Nginx'],
    githubUrl:   'https://github.com',
    liveUrl:     '',
    featured:    false,
  },
];

const SKILLS = [
  { name: 'React',       category: 'Frontend', level: 90, icon: 'react'    },
  { name: 'TypeScript',  category: 'Frontend', level: 80, icon: 'ts'       },
  { name: 'Tailwind CSS',category: 'Frontend', level: 85, icon: 'tailwind' },
  { name: 'Node.js',     category: 'Backend',  level: 88, icon: 'node'     },
  { name: 'MongoDB',     category: 'Backend',  level: 82, icon: 'mongo'    },
  { name: 'Docker',      category: 'DevOps',   level: 70, icon: 'docker'   },
  { name: 'Git',         category: 'Tools',    level: 92, icon: 'git'      },
];

const SEED_CONFIG = {
  ownerName:   'Oluwafemi Oyeniran',
  bio:         'Full-stack developer passionate about building beautiful, performant web experiences. Specialising in React, Node.js, and modern UI systems.',
  status:      'Open to work',
  avatarUrl:   '',
  wallpaper:   'https://picsum.photos/seed/win11/1920/1080',
  socialLinks: {
    github:   'https://github.com/Oluwafemi-John1',
    linkedin: 'https://linkedin.com/in/oluwafemi',
    twitter:  'https://twitter.com',
  },
};

// ── Runner ────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('Connecting to MongoDB…');
  await mongoose.connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME });
  console.log('MongoDB connected\n');

  // ── Projects ──
  console.log('Seeding projects…');
  await Project.deleteMany({});
  const projects = await Project.insertMany(PROJECTS);
  projects.forEach((p) => console.log(`  ✓ Project: ${p.title}`));

  // ── Skills ──
  console.log('\nSeeding skills…');
  await Skill.deleteMany({});
  const skills = await Skill.insertMany(SKILLS);
  skills.forEach((s) => console.log(`  ✓ Skill: ${s.name} (${s.category}, ${s.level}%)`));

  // ── Config ──
  console.log('\nSeeding config…');
  await Config.deleteMany({});
  const cfg = await Config.create(SEED_CONFIG);
  console.log(`  ✓ Config: owner="${cfg.ownerName}", status="${cfg.status}"`);

  console.log('\nSeed complete.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
