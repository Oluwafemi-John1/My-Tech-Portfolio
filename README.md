# My Tech Portfolio — Win11 Edition

A full-stack interactive portfolio built as a Windows 11 desktop simulation. Features a boot screen, lock screen, draggable/resizable application windows, a Start Menu with live search, a notification system, and a password-protected admin panel for managing all content.

---

## Screenshot

> _Replace this placeholder with an actual screenshot once deployed._

```
[ screenshot of desktop with windows open ]
```

---

## Tech Stack

| Layer     | Technology                                    |
|-----------|-----------------------------------------------|
| Frontend  | React 19, Vite 8, Tailwind CSS v4             |
| Animation | Framer Motion 12                              |
| Backend   | Node.js 18+, Express 5                        |
| Database  | MongoDB Atlas (Mongoose 9)                    |
| Auth      | JSON Web Token (24 h expiry, bcrypt password) |
| Email     | Nodemailer (contact form)                     |
| Icons     | Inline SVG — zero icon-library dependencies  |

---

## Prerequisites

- **Node.js 18+** — `node --version` should print `v18.x` or higher
- **npm 9+** (bundled with Node 18)
- **MongoDB Atlas account** — free tier is sufficient
- A Gmail or SMTP account for the contact-form emailer (optional)

---

## Setup

### 1 — Clone the repository

```bash
git clone https://github.com/Oluwafemi-John1/My-Tech-Portfolio.git
cd My-Tech-Portfolio
```

### 2 — Install dependencies

```bash
# Client (React + Vite)
cd client && npm install

# Server (Express + Mongoose)
cd ../server && npm install
```

### 3 — Configure environment variables

**Client** — copy and edit:
```bash
cp client/.env.example client/.env
```

| Variable       | Description                          |
|----------------|--------------------------------------|
| `VITE_API_URL` | Base URL of your Express API, e.g. `http://localhost:5000` |

**Server** — copy and edit:
```bash
cp server/.env.example server/.env
```

| Variable          | Description                                       |
|-------------------|---------------------------------------------------|
| `PORT`            | Express port (default `5000`)                     |
| `MONGO_URI`       | Full MongoDB Atlas connection string              |
| `DB_NAME`         | Database name (e.g. `portfolio`)                  |
| `JWT_SECRET`      | Random string used to sign admin tokens           |
| `ADMIN_USER`      | Admin login username                              |
| `ADMIN_PASS_HASH` | bcrypt hash of your admin password (see step 4)   |
| `EMAIL_USER`      | Gmail address for contact form                    |
| `EMAIL_PASS`      | Gmail app password (not your account password)    |
| `CLIENT_URL`      | Frontend origin for CORS, e.g. `http://localhost:5173` |

### 4 — Generate the admin password hash

```bash
node server/hashPassword.js yourChosenPassword
```

Copy the printed hash into `server/.env` as `ADMIN_PASS_HASH`.

### 5 — Seed the database

```bash
node server/seed.js
```

This inserts sample projects, skills, and a default site config document into your MongoDB Atlas cluster.

### 6 — Run in development

Open **two terminal tabs**:

```bash
# Terminal 1 — API server
cd server && npm run dev

# Terminal 2 — Vite dev server
cd client && npm run dev
```

The app is served at `http://localhost:5173`.

---

## Admin Panel

Press **`Ctrl + Shift + A`** anywhere on the desktop to open the Admin Panel window.

Log in with the username and password you configured in `.env`. From the panel you can:

- Add, edit, and delete portfolio projects
- Update site-wide config (name, bio, wallpaper, social links)
- View submitted contact messages

> `e.preventDefault()` is called on the shortcut, preventing Chrome's native "Search tabs" overlay from firing.

---

## Easter Eggs

There are a few hidden interactions built into the UI. A couple of hints:

- The **power menu** in the Start Menu has more than one mood.
- Keyboards have muscle memory for classic gaming.

Find them yourself — or read the source.

---

## Project Structure

```
Portfolio/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── boot/        # BootScreen, LockScreen
│   │   │   ├── desktop/     # Desktop, DesktopIcon, RightClickMenu
│   │   │   ├── easter/      # BSOD (easter egg)
│   │   │   ├── notifications/ # NotificationCenter, Toast
│   │   │   ├── startmenu/   # StartMenu (with Cortana search)
│   │   │   ├── taskbar/     # Taskbar, SystemTray, Clock
│   │   │   └── windows/     # AboutWindow, ProjectsWindow, …, AdminWindow
│   │   ├── context/         # WindowContext, ThemeContext, ConfigContext, NotificationContext
│   │   ├── hooks/           # useWindow
│   │   ├── pages/           # App.jsx (root orchestrator)
│   │   └── utils/           # zIndex.js
│   └── .env.example
└── server/                  # Express API
    ├── config/              # DB connection
    ├── controllers/         # authController, projectsController, …
    ├── middleware/          # auth.js (JWT protect)
    ├── models/              # Project, Skill, Config, ContactMessage (Mongoose)
    ├── routes/              # /api/projects, /api/skills, /api/config, /api/contact, /api/auth
    ├── hashPassword.js      # CLI tool: generate bcrypt hash
    ├── seed.js              # Seed sample data
    └── .env.example
```

---

## Deployment

### Client → Vercel

1. Push the repo to GitHub.
2. Import the project in [vercel.com](https://vercel.com).
3. Set **Root Directory** to `client`.
4. Add environment variable: `VITE_API_URL=https://your-render-api.onrender.com`
5. Deploy.

### Server → Render

1. Create a new **Web Service** in [render.com](https://render.com).
2. Set **Root Directory** to `server`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all variables from `server/.env.example` in the Render environment tab.
6. Copy the service URL into `VITE_API_URL` in Vercel and `CLIENT_URL` in Render.

### Database → MongoDB Atlas

1. Create a free **M0** cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Add a database user and whitelist `0.0.0.0/0` (or Render's egress IP).
3. Copy the **connection string** into `MONGO_URI` in Render.
4. Run seed.js once from local after pointing `.env` at Atlas.

---

## License

MIT — do whatever you like, attribution appreciated.
