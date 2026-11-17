import { CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { useNotifications } from '../../../hooks/useNotifications';
import type { NotificationType } from '../../../contexts/NotificationContext';
import styles from './Notification.module.css';

const icons: Record<NotificationType, typeof Info> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

export function NotificationToast() {
  const { notifications, dismiss } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className={styles.toastContainer} aria-live="polite">
      {notifications.map((n) => {
        const Icon = icons[n.type];
        return (
          <div key={n.id} className={`${styles.toast} ${styles[n.type]}`}>
            <Icon size={20} className={styles.toastIcon} />
            <div className={styles.toastContent}>
              <p className={styles.toastTitle}>{n.title}</p>
              {n.message && <p className={styles.toastMessage}>{n.message}</p>}
            </div>
            <button
              type="button"
              className={styles.dismiss}
              onClick={() => dismiss(n.id)}
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
