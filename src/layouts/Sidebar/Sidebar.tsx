import { NavLink } from 'react-router-dom';
import { GraduationCap, PanelLeftClose, PanelLeft, X } from 'lucide-react';
import { navigationSections } from '../../config/modules';
import styles from './Sidebar.module.css';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
}

export function Sidebar({
  collapsed,
  mobileOpen,
  onToggle,
  onMobileClose,
}: SidebarProps) {
  const isCollapsed = collapsed && !mobileOpen;

  return (
    <aside
      className={[
        styles.sidebar,
        isCollapsed ? styles.collapsed : '',
        mobileOpen ? styles.mobileOpen : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Main navigation"
    >
      <div className={styles.brand}>
        <div className={styles.logo}>
          <GraduationCap size={22} />
        </div>
        {!isCollapsed && (
          <div className={styles.brandText}>
            <span className={styles.brandName}>CollegeOS</span>
            <span className={styles.brandTag}>Admin</span>
          </div>
        )}
        {mobileOpen && (
          <button
            type="button"
            className={styles.mobileClose}
            onClick={onMobileClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className={styles.nav}>
        {navigationSections.map((section) => (
          <div key={section.id} className={styles.section}>
            {section.title && !isCollapsed && (
              <span className={styles.sectionTitle}>{section.title}</span>
            )}
            {section.title && isCollapsed && (
              <span className={styles.sectionDivider} aria-hidden />
            )}
            <ul className={styles.navList}>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      onClick={onMobileClose}
                      className={({ isActive }) =>
                        `${styles.navItem} ${isActive ? styles.active : ''}`
                      }
                      title={isCollapsed ? item.label : undefined}
                    >
                      <span className={styles.iconWrap}>
                        <Icon size={18} />
                      </span>
                      {!isCollapsed && (
                        <span className={styles.label}>{item.label}</span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <button
        type="button"
        className={styles.collapseBtn}
        onClick={onToggle}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        {!isCollapsed && <span>Collapse</span>}
      </button>
    </aside>
  );
}
