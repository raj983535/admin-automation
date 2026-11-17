import React, { Suspense } from 'react';
import { PageContainer } from '../layouts';
import { Card, CardBody, CardHeader } from '../components/ui';
import { KpiCard } from '../components/dashboard/KpiCard';
import { ActivityFeedWidget } from '../components/dashboard/widgets/ActivityFeedWidget';
import { AutomationWidget } from '../components/dashboard/widgets/AutomationWidget';
import { CommunicationWidget } from '../components/dashboard/widgets/CommunicationWidget';
import { LeadWidget } from '../components/dashboard/widgets/LeadWidget';
import { StudentWidget } from '../components/dashboard/widgets/StudentWidget';
import { FinanceWidget } from '../components/dashboard/widgets/FinanceWidget';
import { AIActivityWidget } from '../components/dashboard/widgets/AIActivityWidget';
import { CounsellingWidget } from '../components/dashboard/widgets/CounsellingWidget';
import { AnalyticsHighlightWidget } from '../components/dashboard/widgets/AnalyticsHighlightWidget';
import { kpiMetrics } from '../mock/dashboard.mock';
import styles from './DashboardPage.module.css';

// Lazy load heavy Recharts components — they load AFTER the dashboard shell renders
const AdmissionsTrendChart = React.lazy(() => import('../components/dashboard/charts/AdmissionsTrendChart').then(m => ({ default: m.AdmissionsTrendChart })));
const ConversionChart = React.lazy(() => import('../components/dashboard/charts/ConversionChart').then(m => ({ default: m.ConversionChart })));
const FeeCollectionChart = React.lazy(() => import('../components/dashboard/charts/FeeCollectionChart').then(m => ({ default: m.FeeCollectionChart })));

const ChartPlaceholder = () => (
  <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
    Loading chart…
  </div>
);

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
            <Suspense fallback={<ChartPlaceholder />}>
              <AdmissionsTrendChart />
            </Suspense>
          </CardBody>
        </Card>
        <Card padding="md" variant="default" className={styles.chartCardNarrow}>
          <CardHeader
            title="Conversion funnel"
            subtitle="Stage counts (active cycle)"
          />
          <CardBody>
            <Suspense fallback={<ChartPlaceholder />}>
              <ConversionChart />
            </Suspense>
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
            <Suspense fallback={<ChartPlaceholder />}>
              <FeeCollectionChart />
            </Suspense>
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
