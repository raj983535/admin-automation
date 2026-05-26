import { useLocation } from 'react-router-dom';
import { getModuleByPath } from '../config/modules';

export function useModuleMeta() {
  const { pathname } = useLocation();
  return getModuleByPath(pathname);
}
