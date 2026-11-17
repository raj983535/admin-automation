import { Bell, Menu, Search, User } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { Button } from '../../components/ui/Button';
import styles from './TopNavbar.module.css';

interface TopNavbarProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export function TopNavbar({ title, subtitle, onMenuClick }: TopNavbarProps) {
  const { notify } = useNotifications();

  return (
    <header className={styles.navbar}>
      {onMenuClick && (
        <Button
          variant="ghost"
          size="sm"
          className={styles.menuBtn}
          aria-label="Open menu"
          icon={<Menu size={20} />}
          onClick={onMenuClick}
        />
      )}
      <div className={styles.titles}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>

      <div className={styles.actions}>
        <div className={styles.search}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="search"
            placeholder="Search students, faculty, records..."
            className={styles.searchInput}
            aria-label="Search"
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          aria-label="Notifications"
          icon={<Bell size={18} />}
          onClick={() =>
            notify({
              type: 'info',
              title: 'Notifications',
              message: 'You have 3 unread updates from the foundation system demo.',
            })
          }
        />

        <div className={styles.profile}>
          <div className={styles.avatar}>
            <User size={18} />
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>Admin User</span>
            <span className={styles.profileRole}>Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
