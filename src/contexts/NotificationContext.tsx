import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationContextValue {
  notifications: Notification[];
  notify: (notification: Omit<Notification, 'id'>) => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

let notificationId = 0;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback(
    (notification: Omit<Notification, 'id'>) => {
      const id = `notif-${++notificationId}`;
      const item: Notification = {
        ...notification,
        id,
        duration: notification.duration ?? 5000,
      };
      setNotifications((prev) => [...prev, item]);

      if (item.duration && item.duration > 0) {
        window.setTimeout(() => dismiss(id), item.duration);
      }
    },
    [dismiss],
  );

  const clearAll = useCallback(() => setNotifications([]), []);

  const value = useMemo(
    () => ({ notifications, notify, dismiss, clearAll }),
    [notifications, notify, dismiss, clearAll],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return ctx;
}
