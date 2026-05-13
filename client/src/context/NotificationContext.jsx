import { createContext, useContext, useReducer, useCallback, useRef } from 'react';

const NotificationContext = createContext(null);

let _nextId = 1;
const MAX_TOASTS = 5;
const TOAST_TTL  = 4000;

function makeNotification(message, type) {
  return { id: `n${_nextId++}`, message, type, timestamp: Date.now(), read: false };
}

const INITIAL = { notifications: [], toasts: [], panelOpen: false };

function reducer(state, action) {
  switch (action.type) {

    case 'ADD':
      return {
        ...state,
        notifications: [action.n, ...state.notifications],
        toasts: [action.n, ...state.toasts].slice(0, MAX_TOASTS),
      };

    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };

    case 'MARK_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.id ? { ...n, read: true } : n
        ),
      };

    case 'CLEAR_ALL':
      return { ...state, notifications: [], toasts: [] };

    case 'TOGGLE_PANEL':
      return {
        ...state,
        panelOpen: !state.panelOpen,
        // Auto-mark all read when opening
        notifications: !state.panelOpen
          ? state.notifications.map((n) => ({ ...n, read: true }))
          : state.notifications,
      };

    default:
      return state;
  }
}

export function NotificationProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const timers = useRef({});

  const removeToast = useCallback((id) => {
    dispatch({ type: 'REMOVE_TOAST', id });
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const addNotification = useCallback((message, type = 'info') => {
    const n = makeNotification(message, type);
    dispatch({ type: 'ADD', n });
    timers.current[n.id] = setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', id: n.id });
      delete timers.current[n.id];
    }, TOAST_TTL);
  }, []);

  const markRead = useCallback((id) => dispatch({ type: 'MARK_READ', id }), []);

  const clearAll = useCallback(() => {
    Object.values(timers.current).forEach(clearTimeout);
    timers.current = {};
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const togglePanel = useCallback(() => dispatch({ type: 'TOGGLE_PANEL' }), []);

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications: state.notifications,
      toasts:        state.toasts,
      panelOpen:     state.panelOpen,
      unreadCount,
      addNotification,
      removeToast,
      markRead,
      clearAll,
      togglePanel,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used inside <NotificationProvider>');
  return ctx;
}
