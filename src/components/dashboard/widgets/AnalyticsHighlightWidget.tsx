import { Card, CardBody, CardHeader } from '../../ui';
import { analyticsHighlights } from '../../../data/mock/dashboard';
import { stageSolid } from '../chartTheme';
import styles from './Widgets.module.css';

export function AnalyticsHighlightWidget() {
  return (
    <Card padding="md" variant="default">
      <CardHeader title="Analytics" subtitle="Key operational metrics" />
      <CardBody>
        <div className={styles.analyticsGrid}>
          {analyticsHighlights.map((item) => (
            <div
              key={item.label}
              className={styles.analyticsItem}
              style={{ borderTop: `3px solid ${stageSolid[item.stage]}` }}
            >
              <p className={styles.analyticsValue}>{item.value}</p>
              <p className={styles.analyticsLabel}>{item.label}</p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
