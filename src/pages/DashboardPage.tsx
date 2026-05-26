import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader } from '../components/ui';
import { KpiCard } from '../components/dashboard/KpiCard';
import { AdmissionsTrendChart } from '../components/dashboard/charts/AdmissionsTrendChart';
import { ConversionChart } from '../components/dashboard/charts/ConversionChart';
import { FeeCollectionChart } from '../components/dashboard/charts/FeeCollectionChart';
import { ActivityFeedWidget } from '../components/dashboard/widgets/ActivityFeedWidget';
import { AutomationWidget } from '../components/dashboard/widgets/AutomationWidget';
import { CommunicationWidget } from '../components/dashboard/widgets/CommunicationWidget';
import { LeadWidget } from '../components/dashboard/widgets/LeadWidget';
import { StudentWidget } from '../components/dashboard/widgets/StudentWidget';
import { FinanceWidget } from '../components/dashboard/widgets/FinanceWidget';
import { AIActivityWidget } from '../components/dashboard/widgets/AIActivityWidget';
import { CounsellingWidget } from '../components/dashboard/widgets/CounsellingWidget';
import { AnalyticsHighlightWidget } from '../components/dashboard/widgets/AnalyticsHighlightWidget';
import { kpiMetrics } from '../data/mock/dashboard';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  return (
    <PageContainer maxWidth="wide">
      <p className={styles.intro}>
        Real-time snapshot of admissions, engagement, communications, and
        operations — demo data for presentation.
      </p>

      <section className={styles.kpiGrid} aria-label="Key performance indicators">
        {kpiMetrics.map((metric) => (
          <KpiCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className={styles.chartRow} aria-label="Trend charts">
        <Card padding="md" variant="default" className={styles.chartCardWide}>
          <CardHeader
            title="Inquiries & leads"
            subtitle="Daily volume — last 7 days"
          />
          <CardBody>
            <AdmissionsTrendChart />
          </CardBody>
        </Card>
        <Card padding="md" variant="default" className={styles.chartCardNarrow}>
          <CardHeader
            title="Conversion funnel"
            subtitle="Stage counts (active cycle)"
          />
          <CardBody>
            <ConversionChart />
          </CardBody>
        </Card>
      </section>

      <section className={styles.chartRow} aria-label="Finance chart">
        <Card padding="md" variant="default" className={styles.chartCardWide}>
          <CardHeader
            title="Fee collection trend"
            subtitle="Collected vs monthly target (₹ lakhs)"
          />
          <CardBody>
            <FeeCollectionChart />
          </CardBody>
        </Card>
        <div className={styles.chartCardNarrow}>
          <FinanceWidget />
        </div>
      </section>

      <section className={styles.widgetRow}>
        <AnalyticsHighlightWidget />
        <CommunicationWidget />
      </section>

      <section className={styles.widgetRow}>
        <div className={styles.widgetGrow}>
          <ActivityFeedWidget />
        </div>
        <div className={styles.widgetGrow}>
          <AutomationWidget />
        </div>
      </section>

      <section className={styles.widgetRow}>
        <div className={styles.widgetGrow}>
          <LeadWidget />
        </div>
        <div className={styles.widgetGrow}>
          <StudentWidget />
        </div>
      </section>

      <section className={styles.widgetRow}>
        <div className={styles.widgetGrow}>
          <CounsellingWidget />
        </div>
        <div className={styles.widgetGrow}>
          <AIActivityWidget />
        </div>
      </section>
    </PageContainer>
  );
}
