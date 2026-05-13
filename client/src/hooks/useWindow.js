import { useWindowContext } from '../context/WindowContext';

/**
 * useWindow - exposes the full window management API from WindowContext.
 */
export function useWindow() {
  return useWindowContext();
}
