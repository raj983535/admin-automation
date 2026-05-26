import { Card, CardBody, CardHeader } from '../../ui';
import { studentEngagement } from '../../../data/mock/dashboard';
import styles from './Widgets.module.css';

export function StudentWidget() {
  return (
    <Card padding="md" variant="default">
      <CardHeader title="Student engagement" subtitle="Active participation by school" />
      <CardBody>
        <div className={styles.list}>
          {studentEngagement.map((row) => (
            <div key={row.program} className={styles.engagementRow}>
              <span className={styles.engagementLabel}>{row.program}</span>
              <div className={styles.engagementBar}>
                <div
                  className={styles.engagementFill}
                  style={{ width: `${row.active}%` }}
                />
              </div>
              <span className={styles.engagementPct}>{row.label}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
