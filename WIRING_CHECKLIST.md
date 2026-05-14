# Wiring Audit Checklist

Verified against the live codebase on build passing (`npx vite build` — 443 modules, 0 errors).

---

## 1. Desktop Icons → Window IDs

Each `id` in `Desktop.jsx::ICONS` must exist in `WindowContext::WINDOW_REGISTRY`.

| Desktop icon id | WINDOW_REGISTRY entry | Status |
|-----------------|----------------------|--------|
| `about`         | ✅ `about`            | ✅ |
| `projects`      | ✅ `projects`         | ✅ |
| `skills`        | ✅ `skills`           | ✅ |
| `resume`        | ✅ `resume`           | ✅ |
| `contact`       | ✅ `contact`          | ✅ |

- [x] All desktop icon IDs resolve to a registered window
- [x] `admin` is intentionally absent from desktop icons (access only via shortcut / Start Menu)

---

## 2. Taskbar Icons → Window IDs

Each key in `Taskbar.jsx::WINDOW_ICONS` must match a window id. Admin is excluded from the taskbar bar by design.

| WINDOW_ICONS key | Rendered for open window? | Status |
|------------------|--------------------------|--------|
| `about`          | ✅                        | ✅ |
| `projects`       | ✅                        | ✅ |
| `skills`         | ✅                        | ✅ |
| `resume`         | ✅                        | ✅ |
| `contact`        | ✅                        | ✅ |

- [x] `windows.filter((w) => w.id !== 'admin')` prevents the admin window from appearing in the taskbar
- [x] Fallback renders the window title's first initial when `WINDOW_ICONS[id]` is `null` (safety net for future windows)

---

## 3. WindowManager CONTENT_MAP → Window IDs

Each key in `WindowManager.jsx::CONTENT_MAP` must match a WINDOW_REGISTRY entry.

| CONTENT_MAP key | WINDOW_REGISTRY entry | Status |
|-----------------|----------------------|--------|
| `about`         | ✅                    | ✅ |
| `skills`        | ✅                    | ✅ |
| `resume`        | ✅                    | ✅ |
| `projects`      | ✅                    | ✅ |
| `contact`       | ✅                    | ✅ |
| `admin`         | ✅                    | ✅ |

- [x] All 6 window IDs have both a registry entry and a content component

---

## 4. Start Menu Pinned Apps → Window IDs

`StartMenu.jsx::PINNED_APPS` uses `openWindow(id)` on click.

| Pinned app id | WINDOW_REGISTRY entry | Handled |
|---------------|----------------------|---------|
| `about`       | ✅                    | ✅ |
| `projects`    | ✅                    | ✅ |
| `skills`      | ✅                    | ✅ |
| `resume`      | ✅                    | ✅ |
| `contact`     | ✅                    | ✅ |
| `settings`    | ⚠️ not in registry   | ✅ guarded — `handlePinnedClick` skips `openWindow` for `settings` |

- [x] Settings gracefully no-ops (no unregistered window opened)
- [x] Cortana search results open `projects` window for project matches — valid registry ID

---

## 5. All API Calls Use `VITE_API_URL`

Every `fetch` call that hits the Express API must use the `API_BASE` constant derived from `import.meta.env.VITE_API_URL ?? 'http://localhost:5000'`.

| File | `API_BASE` declared | Status |
|------|---------------------|--------|
| `context/ConfigContext.jsx`        | ✅ | ✅ |
| `context/StartMenu.jsx`            | ✅ | ✅ |
| `windows/AdminWindow.jsx`          | ✅ | ✅ |
| `windows/ContactWindow.jsx`        | ✅ | ✅ |
| `windows/ProjectsWindow.jsx`       | ✅ | ✅ |

- [x] No hardcoded `localhost:5000` strings outside of the `?? 'http://localhost:5000'` fallback
- [x] Client `.env.example` documents `VITE_API_URL`

---

## 6. Provider Nesting Order (App.jsx)

Outer-to-inner: `ThemeProvider → NotificationProvider → ConfigProvider → WindowProvider`

- [x] `ThemeProvider` is the outermost wrapper — CSS variable theme is available everywhere
- [x] `NotificationProvider` wraps `ConfigProvider` and `WindowProvider` — `useNotification()` is available in all windows and in `AppInit`
- [x] `ConfigProvider` wraps `WindowProvider` — `useConfig()` is available in Desktop and all windows
- [x] `WindowProvider` is the innermost of the four — `useWindow()` is available in Taskbar, StartMenu, WindowManager, AppShortcuts, and AppInit
- [x] `AppInit` (welcome notification) lives inside `WindowProvider`, giving it access to all four contexts

---

## 7. ConfigContext — Default Before Load

- [x] `ConfigContext` initialises state with `DEFAULT_CONFIG` synchronously — no window ever reads `undefined`
- [x] `loading` flag is exposed; `AppInit` checks `if (fired.current || loading) return` before sending the welcome notification
- [x] `Desktop.jsx` falls back to `FALLBACK_WALLPAPER` when `config.wallpaper` is empty — safe even before the API responds

---

## 8. Notification Bell Badge

- [x] `unreadCount` = `state.notifications.filter((n) => !n.read).length` — computed in context, not in component
- [x] `SystemTray` renders `<span … bg-red-500>` only when `unreadCount > 0`
- [x] Opening the panel dispatches `TOGGLE_PANEL` which auto-marks all notifications `read: true` — badge clears on open
- [x] `Toast` stack is bounded at `MAX_TOASTS = 5` — no unbounded DOM growth
- [x] Toasts auto-remove after `TOAST_TTL = 4000 ms` via `setTimeout` stored in a `useRef` map for cleanup on unmount

---

## 9. Admin `Ctrl+Shift+A` Shortcut

- [x] `e.preventDefault()` is called before `openWindow('admin')` — suppresses Chrome's native "Search tabs" overlay
- [x] Shortcut is registered inside `AppShortcuts` which lives inside `WindowProvider` — `openWindow` is always available when the handler fires
- [x] Cleanup: `window.removeEventListener('keydown', handler)` is returned from `useEffect` — no listener leak on HMR or unmount
- [x] `BSOD` Konami listener lives in `App` (outside providers) — no conflict with the admin shortcut, different key sequences
- [x] Both listeners attach to `window` keydown independently — no shared mutable state

---

## 10. Easter Egg Isolation

- [x] `BSOD` is an **early return** in `App` — renders nothing from the provider tree, no context used
- [x] `MobileFallback` is an **early return** — same isolation guarantee
- [x] `ShutdownScreen` is rendered by `StartMenu` state — isolated inside `WindowProvider`, no global side effects
- [x] Konami buffer is a `useRef` — never triggers re-renders while accumulating keys

---

## 11. Build Verification

- [x] `npx vite build` exits 0 — 443 modules transformed, 0 errors, 0 warnings
- [x] No duplicate exports
- [x] No missing imports (all context/hook imports resolve)

---

## Summary

| Category | Items checked | Issues found | Issues fixed |
|----------|--------------|-------------|-------------|
| Desktop → Window IDs | 5 | 0 | — |
| Taskbar → Window IDs | 5 | 0 | — |
| CONTENT_MAP → Registry | 6 | 0 | — |
| Start Menu IDs | 6 | 0 | — |
| API base URL | 5 files | 0 | — |
| Provider order | 4 levels | 0 | — |
| Config default-before-load | 3 checks | 0 | — |
| Notification badge | 5 checks | 0 | — |
| Admin shortcut | 5 checks | 0 | — |
| Easter egg isolation | 4 checks | 0 | — |
| Build | 1 run | 0 | — |
| **Total** | **45** | **0** | **0** |

All 45 wiring checks pass. ✅
