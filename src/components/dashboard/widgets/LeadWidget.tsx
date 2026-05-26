import { Card, CardBody, CardHeader } from '../../ui';
import { StageChip } from '../../ui/StageChip';
import { topLeads, pipelinePreview } from '../../../data/mock/dashboard';
import { workflowStageLabels } from '../../../theme';
import styles from './Widgets.module.css';

export function LeadWidget() {
  return (
    <Card padding="md" variant="default">
      <CardHeader title="Leads & pipeline" subtitle="Top prospects and recent movement" />
      <CardBody>
        <p className={styles.widgetSectionTitle}>Top leads by score</p>
        <div className={styles.list}>
          {topLeads.map((lead) => (
            <div key={lead.id} className={styles.leadRow}>
              <div className={styles.leadInfo}>
                <p className={styles.leadName}>{lead.name}</p>
                <p className={styles.leadProgram}>{lead.program}</p>
              </div>
              <StageChip
                stage={lead.stage}
                label={workflowStageLabels[lead.stage]}
                size="sm"
              />
              <span className={styles.leadScore}>{lead.score}</span>
            </div>
          ))}
        </div>
        <p className={styles.widgetSectionTitle}>Recent pipeline</p>
        <div className={styles.list}>
          {pipelinePreview.map((row) => (
            <div key={row.id} className={styles.leadRow}>
              <div className={styles.leadInfo}>
                <p className={styles.leadName}>{row.name}</p>
                <p className={styles.leadProgram}>{row.department}</p>
              </div>
              <StageChip
                stage={row.stage}
                label={workflowStageLabels[row.stage]}
                size="sm"
              />
              <span className={styles.itemMeta}>{row.updatedAt}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
