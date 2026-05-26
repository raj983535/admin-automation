import { Card, CardBody, CardHeader } from '../../ui';
import { counsellingSessions } from '../../../data/mock/dashboard';
import { stageSolid } from '../chartTheme';
import styles from './Widgets.module.css';

export function CounsellingWidget() {
  return (
    <Card padding="md" variant="default">
      <CardHeader title="Counselling" subtitle="Upcoming sessions" />
      <CardBody>
        <div className={styles.list}>
          {counsellingSessions.map((s) => (
            <div
              key={s.id}
              className={styles.counsellingItem}
              style={{ borderLeft: `3px solid ${stageSolid[s.stage]}` }}
            >
              <div>
                <p className={styles.itemTitle}>{s.student}</p>
                <p className={styles.itemDetail}>
                  {s.counsellor} · {s.type}
                </p>
              </div>
              <span className={styles.counsellingTime}>{s.time}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
