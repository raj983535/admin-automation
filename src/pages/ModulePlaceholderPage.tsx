import { Construction } from 'lucide-react';
import { PageContainer } from '../layouts';
import { Card, CardBody, StageChip } from '../components/ui';
import { useModuleMeta } from '../hooks/useModuleMeta';
import { getSectionLabel } from '../config/modules';
import styles from './ModulePlaceholderPage.module.css';

export function ModulePlaceholderPage() {
  const module = useModuleMeta();
  const sectionLabel = getSectionLabel(module.section);
  const Icon = module.icon;

  const breadcrumbs =
    module.id === 'dashboard'
      ? []
      : [{ label: sectionLabel }, { label: module.label }];

  return (
    <PageContainer breadcrumbs={breadcrumbs.length > 0 ? breadcrumbs : undefined}>
      <Card padding="lg" variant="elevated" className={styles.placeholder}>
        <CardBody>
          <div className={styles.iconWrap}>
            <Icon size={32} />
          </div>
          <StageChip stage="yellow" label="Placeholder" />
          <h2 className={styles.title}>{module.title}</h2>
          <p className={styles.desc}>
            This module is wired into navigation and routing. Detailed
            functionality will be built in a later prompt.
          </p>
          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <Construction size={14} />
              Section: {sectionLabel}
            </span>
            <span className={styles.metaItem}>Route: {module.path}</span>
          </div>
        </CardBody>
      </Card>
    </PageContainer>
  );
}
