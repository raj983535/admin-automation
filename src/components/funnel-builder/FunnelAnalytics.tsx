import { memo, useMemo } from 'react';
import { X, TrendingUp, Users, ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '../ui/Button';
import type { FunnelStep } from '../../types/builder.types';
import styles from './FunnelAnalytics.module.css';

interface FunnelAnalyticsProps {
  steps: FunnelStep[];
  onClose: () => void;
}

function FunnelAnalyticsComponent({ steps, onClose }: FunnelAnalyticsProps) {
  const handleExport = () => {
    const header = ['Step', 'Type', 'Visitors', 'Conversions', 'Conversion Rate', 'Drop Off'];
    const rows = steps.map((step) => [
      step.name,
      step.type,
      String(step.visitors),
      String(step.conversions),
      `${step.conversionRate.toFixed(1)}%`,
      `${step.dropOffRate.toFixed(1)}%`,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'funnel-analytics-demo.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const metrics = useMemo(() => {
    if (steps.length === 0) {
      return {
        totalVisitors: 0,
        totalConversions: 0,
        overallConversion: 0,
        avgConversion: 0,
        biggestDropOff: null as FunnelStep | null,
        bestPerforming: null as FunnelStep | null
      };
    }

    const totalVisitors = steps[0]?.visitors || 0;
    const totalConversions = steps[steps.length - 1]?.conversions || 0;
    const overallConversion = totalVisitors > 0 ? (totalConversions / totalVisitors) * 100 : 0;
    const avgConversion = steps.reduce((sum, step) => sum + step.conversionRate, 0) / steps.length;
    
    const biggestDropOff = steps.reduce((max, step) => 
      step.dropOffRate > (max?.dropOffRate || 0) ? step : max, steps[0]);
    
    const bestPerforming = steps.reduce((max, step) => 
      step.conversionRate > (max?.conversionRate || 0) ? step : max, steps[0]);

    return {
      totalVisitors,
      totalConversions,
      overallConversion,
      avgConversion,
      biggestDropOff,
      bestPerforming
    };
  }, [steps]);

  return (
    <div className={styles.analyticsPanel}>
      <div className={styles.analyticsHeader}>
        <div className={styles.headerTitleRow}>
          <TrendingUp size={16} />
          <h3 className={styles.analyticsTitle}>Funnel Analytics</h3>
        </div>
        <button onClick={onClose} className={styles.closeButton}>
          <X size={16} />
        </button>
      </div>

      <div className={styles.analyticsContent}>
        <div className={styles.summaryCards}>
          <div className={styles.summaryCard}>
            <div className={styles.cardIcon}>
              <Users size={20} />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardLabel}>Total Visitors</span>
              <span className={styles.cardValue}>{metrics.totalVisitors.toLocaleString()}</span>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.cardIcon}>
              <TrendingUp size={20} />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardLabel}>Conversions</span>
              <span className={styles.cardValue}>{metrics.totalConversions.toLocaleString()}</span>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.cardIcon}>
              <ArrowUp size={20} />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardLabel}>Overall Rate</span>
              <span className={styles.cardValue}>{metrics.overallConversion.toFixed(1)}%</span>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.cardIcon}>
              <TrendingUp size={20} />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardLabel}>Avg Rate</span>
              <span className={styles.cardValue}>{metrics.avgConversion.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className={styles.insightsSection}>
          <h4 className={styles.insightsTitle}>Key Insights</h4>
          
          {metrics.biggestDropOff && (
            <div className={styles.insightCard}>
              <div className={styles.insightHeader}>
                <ArrowDown size={16} className={styles.insightIcon} />
                <span className={styles.insightLabel}>Biggest Drop-off</span>
              </div>
              <div className={styles.insightContent}>
                <span className={styles.insightStep}>{metrics.biggestDropOff.name}</span>
                <span className={styles.insightValue}>{metrics.biggestDropOff.dropOffRate.toFixed(1)}%</span>
              </div>
            </div>
          )}

          {metrics.bestPerforming && (
            <div className={styles.insightCard}>
              <div className={styles.insightHeader}>
                <ArrowUp size={16} className={styles.insightIcon} />
                <span className={styles.insightLabel}>Best Performing</span>
              </div>
              <div className={styles.insightContent}>
                <span className={styles.insightStep}>{metrics.bestPerforming.name}</span>
                <span className={styles.insightValue}>{metrics.bestPerforming.conversionRate.toFixed(1)}%</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.stepsBreakdown}>
          <h4 className={styles.breakdownTitle}>Step Breakdown</h4>
          <div className={styles.stepList}>
            {steps.map((step) => (
              <div key={step.id} className={styles.stepRow}>
                <div className={styles.stepInfo}>
                  <div 
                    className={styles.stepColor} 
                    style={{ background: step.color }}
                  />
                  <span className={styles.stepName}>{step.name}</span>
                </div>
                <div className={styles.stepMetrics}>
                  <div className={styles.stepMetric}>
                    <span className={styles.metricLabel}>Visitors</span>
                    <span className={styles.metricValue}>{step.visitors.toLocaleString()}</span>
                  </div>
                  <div className={styles.stepMetric}>
                    <span className={styles.metricLabel}>Conv.</span>
                    <span className={styles.metricValue}>{step.conversionRate.toFixed(1)}%</span>
                  </div>
                  <div className={styles.stepMetric}>
                    <span className={styles.metricLabel}>Drop</span>
                    <span className={styles.metricValue}>{step.dropOffRate.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.analyticsFooter}>
        <Button variant="secondary" size="sm" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" size="sm" onClick={handleExport}>
          Export Report
        </Button>
      </div>
    </div>
  );
}

export const FunnelAnalytics = memo(FunnelAnalyticsComponent);
