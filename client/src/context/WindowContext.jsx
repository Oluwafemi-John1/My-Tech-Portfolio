import { createContext, useContext, useReducer, useRef, useState } from 'react';
import { Z } from '../utils/zIndex';

const WindowContext = createContext(null);

const DEFAULT_SIZE = { width: 820, height: 560 };
const DEFAULT_POS  = { x: 80,  y: 60 };

// Per-window default titles and sizes — add new windows here.
export const WINDOW_REGISTRY = {
  about:    { title: 'About Me', size: { width: 480, height: 380 } },
  projects: { title: 'Projects', size: { width: 640, height: 480 } },
  skills:   { title: 'Skills.txt', size: { width: 500, height: 420 } },
  resume:   { title: 'Resume.pdf', size: { width: 560, height: 500 } },
  contact:  { title: 'Contact.lnk', size: { width: 480, height: 460 } },
};

function makeWindow(id, title, icon, zIndex, cascade = 0, defaultSize = DEFAULT_SIZE) {
  return {
    id,
    title:         title ?? id,
    icon:          icon  ?? null,
    isOpen:        true,
    isMinimized:   false,
    isFocused:     true,
    isMaximized:   false,
    position:      { x: DEFAULT_POS.x + cascade, y: DEFAULT_POS.y + cascade },
    size:          { ...defaultSize },
    savedPosition: null,
    savedSize:     null,
    zIndex,
  };
}

function reducer(state, action) {
  switch (action.type) {

    case 'OPEN': {
      const exists = state.find((w) => w.id === action.id);
      if (exists) {
        return state.map((w) =>
          w.id === action.id
            ? { ...w, isOpen: true, isMinimized: false, isFocused: true, zIndex: action.zIndex }
            : { ...w, isFocused: false }
        );
      }
      return [
        ...state.map((w) => ({ ...w, isFocused: false })),
        makeWindow(action.id, action.title, action.icon, action.zIndex, action.cascade, action.defaultSize),
      ];
    }

    case 'CLOSE':
      return state.filter((w) => w.id !== action.id);

    case 'MINIMIZE':
      return state.map((w) =>
        w.id === action.id ? { ...w, isMinimized: true, isFocused: false } : w
      );

    case 'MAXIMIZE':
      return state.map((w) => {
        if (w.id !== action.id) return w;
        if (w.isMaximized) {
          return {
            ...w,
            isMaximized:   false,
            position:      w.savedPosition ?? { ...DEFAULT_POS },
            size:          w.savedSize     ?? { ...DEFAULT_SIZE },
            savedPosition: null,
            savedSize:     null,
          };
        }
        return {
          ...w,
          isMaximized:   true,
          savedPosition: { ...w.position },
          savedSize:     { ...w.size },
          position:      { x: 0, y: 0 },
          size:          { width: action.vw, height: action.vh },
        };
      });

    case 'FOCUS':
      return state.map((w) =>
        w.id === action.id
          ? { ...w, isFocused: true, isMinimized: false, zIndex: action.zIndex }
          : { ...w, isFocused: false }
      );

    case 'UPDATE_POSITION':
      return state.map((w) =>
        w.id === action.id ? { ...w, position: action.position } : w
      );

    case 'UPDATE_SIZE':
      return state.map((w) =>
        w.id === action.id ? { ...w, size: action.size } : w
      );

    default:
      return state;
  }
}

export function WindowProvider({ children }) {
  const [windows, dispatch]           = useReducer(reducer, []);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const zCounter = useRef(Z.window);

  const openWindow = (id, title, icon) => {
    zCounter.current += 1;
    const cascade     = (windows.filter((w) => w.isOpen).length % 8) * 28;
    const reg         = WINDOW_REGISTRY[id];
    dispatch({
      type:        'OPEN',
      id,
      title:       title ?? reg?.title,
      icon,
      zIndex:      zCounter.current,
      cascade,
      defaultSize: reg?.size ?? DEFAULT_SIZE,
    });
  };

  const closeWindow    = (id) => dispatch({ type: 'CLOSE',    id });
  const minimizeWindow = (id) => dispatch({ type: 'MINIMIZE', id });

  const maximizeWindow = (id) => {
    dispatch({
      type: 'MAXIMIZE',
      id,
      vw: globalThis.innerWidth,
      vh: globalThis.innerHeight - 48,
    });
  };

  const focusWindow = (id) => {
    zCounter.current += 1;
    dispatch({ type: 'FOCUS', id, zIndex: zCounter.current });
  };

  const updatePosition = (id, position) =>
    dispatch({ type: 'UPDATE_POSITION', id, position });

  const updateSize = (id, size) =>
    dispatch({ type: 'UPDATE_SIZE', id, size });

  const toggleStart = () => setStartMenuOpen((v) => !v);

  return (
    <WindowContext.Provider
      value={{
        windows,
        openWindow, closeWindow, minimizeWindow, maximizeWindow,
        focusWindow, updatePosition, updateSize,
        startMenuOpen, toggleStart,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
}

export function useWindowContext() {
  return useContext(WindowContext);
}
