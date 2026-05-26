import { Card, CardBody, CardHeader } from '../../ui';
import { automationRuns } from '../../../data/mock/dashboard';
import { stageSolid } from '../chartTheme';
import styles from './Widgets.module.css';

export function AutomationWidget() {
  return (
    <Card padding="md" variant="default">
      <CardHeader title="Automation" subtitle="Workflow runs and progress" />
      <CardBody>
        <div className={styles.list}>
          {automationRuns.map((run) => (
            <div key={run.id} className={styles.progressRow}>
              <div className={styles.progressHeader}>
                <span className={styles.progressName}>{run.name}</span>
                <span className={styles.itemMeta}>{run.status}</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${run.progress}%`,
                    backgroundColor: stageSolid[run.stage],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
