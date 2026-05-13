import { AnimatePresence } from 'framer-motion';
import { useWindow }        from '../../hooks/useWindow';
import { WindowFrame }      from './WindowFrame';
import { AboutWindow }      from './AboutWindow';
import { SkillsWindow }     from './SkillsWindow';
import { ResumeWindow }     from './ResumeWindow';
import { ProjectsWindow }   from './ProjectsWindow';
import { ContactWindow }    from './ContactWindow';
import { AdminWindow }      from './AdminWindow';
import { Z }                from '../../utils/zIndex';

/**
 * CONTENT_MAP — maps window id → the JSX content rendered inside its frame.
 */
const CONTENT_MAP = {
  about:    <AboutWindow />,
  skills:   <SkillsWindow />,
  resume:   <ResumeWindow />,
  projects: <ProjectsWindow />,
  contact:  <ContactWindow />,
  admin:    <AdminWindow />,
};

/**
 * WindowManager
 * Reads the windows[] array from context and renders a WindowFrame for
 * every window that is open and not minimized.
 *
 * The fixed container is pointer-events-none so clicks on empty desktop
 * areas pass through; each WindowFrame re-enables pointer-events.
 */
export function WindowManager() {
  const { windows } = useWindow();

  const visible = windows.filter((w) => w.isOpen && !w.isMinimized);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: Z.window }}
    >
      <AnimatePresence>
        {visible.map((win) => (
          <WindowFrame key={win.id} win={win}>
            {CONTENT_MAP[win.id] ?? null}
          </WindowFrame>
        ))}
      </AnimatePresence>
    </div>
  );
}
