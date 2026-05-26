import { useCallback } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { metricDetailMessage } from '../utils/metricDetail';

export function useMetricClick() {
  const { notify } = useNotifications();

  return useCallback(
    (label: string, value: string) => {
      const { title, message } = metricDetailMessage(label, value);
      notify({ type: 'info', title, message, duration: 2200 });
    },
    [notify],
  );
}
