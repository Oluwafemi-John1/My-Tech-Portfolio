/**
 * zIndex — centralised z-index layer map for the Win11 UI stack.
 * Values to be tuned during implementation.
 */
export const Z = {
  desktop:           10,
  window:            100,   // base; incremented per focused window
  windowFocused:     200,
  startMenu:         500,
  taskbar:           600,
  notificationPanel: 700,
  toast:             800,
  lockScreen:        900,
  bootScreen:        1000,
};
