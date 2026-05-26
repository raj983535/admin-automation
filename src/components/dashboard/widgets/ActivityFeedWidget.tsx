import { Card, CardBody, CardHeader } from '../../ui';
import { activityFeed } from '../../../data/mock/dashboard';
import { stageSolid } from '../chartTheme';
import styles from './Widgets.module.css';

export function ActivityFeedWidget() {
  return (
    <Card padding="md" variant="default">
      <CardHeader title="Activity feed" subtitle="Admissions, workflows, and payments" />
      <CardBody>
        <ul className={styles.list}>
          {activityFeed.map((item) => (
            <li
              key={item.id}
              className={styles.item}
              style={{ borderLeft: `3px solid ${stageSolid[item.stage]}` }}
            >
              <div className={styles.itemBody}>
                <p className={styles.itemTitle}>{item.title}</p>
                <p className={styles.itemDetail}>{item.detail}</p>
              </div>
              <span className={styles.itemMeta}>{item.time}</span>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
