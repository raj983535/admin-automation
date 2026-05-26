import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import { TopNavbar } from '../TopNavbar';
import { NotificationToast } from '../../components/ui/Notification';
import { useModuleMeta } from '../../hooks/useModuleMeta';
import styles from './AppShell.module.css';

export function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const meta = useModuleMeta();

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className={styles.app}>
      {mobileOpen && (
        <button
          type="button"
          className={styles.overlay}
          onClick={closeMobile}
          aria-label="Close navigation"
        />
      )}

      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        onMobileClose={closeMobile}
      />

      <div
        className={`${styles.mainArea} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}
      >
        <TopNavbar
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setMobileOpen(true)}
        />
        <Outlet />
      </div>

      <NotificationToast />
    </div>
  );
}
