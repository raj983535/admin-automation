import { createContext } from 'react';
import type { NotificationContextValue } from './NotificationContext';

export const NotificationContext = createContext<NotificationContextValue | null>(null);
