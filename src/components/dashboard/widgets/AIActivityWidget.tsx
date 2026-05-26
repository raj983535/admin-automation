import { Card, CardBody, CardHeader } from '../../ui';
import { aiActivity } from '../../../data/mock/dashboard';
import styles from './Widgets.module.css';

export function AIActivityWidget() {
  return (
    <Card padding="md" variant="default">
      <CardHeader title="AI activity" subtitle="Automations and assist volume" />
      <CardBody>
        <div className={styles.list}>
          {aiActivity.map((row) => (
            <div key={row.id} className={styles.aiRow}>
              <div>
                <p className={styles.itemTitle}>{row.action}</p>
                <p className={styles.itemMeta}>{row.time}</p>
              </div>
              <span className={styles.aiCount}>{row.count}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
