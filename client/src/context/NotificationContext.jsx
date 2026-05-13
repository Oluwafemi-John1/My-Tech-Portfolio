import { createContext, useContext, useReducer, useCallback } from 'react';

const NotificationContext = createContext(null);

let _nextId = 1;

function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, action.toast];
    case 'REMOVE':
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}

export function NotificationProvider({ children }) {
  const [toasts, dispatch] = useReducer(reducer, []);

  const removeToast = useCallback((id) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  /**
   * addToast(message, type?, duration?)
   *   type:     'success' | 'error' | 'info'  (default 'info')
   *   duration: ms before auto-dismiss         (default 4000, 0 = never)
   */
  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = `t${_nextId++}`;
    dispatch({ type: 'ADD', toast: { id, message, type } });
    if (duration > 0) {
      setTimeout(() => dispatch({ type: 'REMOVE', id }), duration);
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used inside <NotificationProvider>');
  return ctx;
}
