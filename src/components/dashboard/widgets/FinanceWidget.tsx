import { Card, CardBody, CardHeader } from '../../ui';
import { StageChip } from '../../ui/StageChip';
import { financeBreakdown, financeSummary } from '../../../data/mock/dashboard';
import styles from './Widgets.module.css';

function formatLakh(n: number) {
  return `₹${(n / 100000).toFixed(1)}L`;
}

export function FinanceWidget() {
  const pct = Math.round((financeSummary.collected / financeSummary.target) * 100);
  return (
    <Card padding="md" variant="default">
      <CardHeader title="Finance" subtitle="Collection vs target (demo)" />
      <CardBody>
        <div className={styles.financeHero}>
          <span className={styles.financeTotal}>{formatLakh(financeSummary.collected)}</span>
          <span className={styles.financeTarget}>
            of {formatLakh(financeSummary.target)} target · {pct}%
          </span>
        </div>
        <div className={styles.statGrid}>
          <div className={styles.statBox}>
            <p className={styles.statValue}>{formatLakh(financeSummary.pending)}</p>
            <p className={styles.statLabel}>Pending</p>
          </div>
          <div className={styles.statBox}>
            <p className={styles.statValue}>{formatLakh(financeSummary.overdue)}</p>
            <p className={styles.statLabel}>Overdue</p>
          </div>
        </div>
        <p className={styles.widgetSectionTitle}>By category</p>
        <div className={styles.financeBreakdown}>
          {financeBreakdown.map((row) => (
            <div key={row.label} className={styles.breakdownRow}>
              <StageChip
                stage={row.stage}
                label={row.label}
                size="sm"
              />
              <span className={styles.breakdownAmount}>₹{row.amount}L</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
