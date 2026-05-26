import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  MessageCircle,
  Users,
  TrendingUp,
  Workflow,
  Wallet,
  GraduationCap,
  Sparkles,
  Calendar,
  Inbox,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { StageChip } from '../ui/StageChip';
import type { KpiMetric } from '../../data/mock/dashboard';
import styles from './KpiCard.module.css';

const icons = {
  inquiries: Inbox,
  leads: Users,
  conversion: TrendingUp,
  whatsapp: MessageCircle,
  workflow: Workflow,
  finance: Wallet,
  students: GraduationCap,
  ai: Sparkles,
  calendar: Calendar,
};

const trendIcons = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  neutral: Minus,
};

interface KpiCardProps {
  metric: KpiMetric;
}

export function KpiCard({ metric }: KpiCardProps) {
  const Icon = icons[metric.icon];
  const TrendIcon = trendIcons[metric.trend];

  return (
    <Card padding="md" variant="default" className={styles.kpi}>
      <div className={styles.top}>
        <span className={styles.iconWrap}>
          <Icon size={18} />
        </span>
        <StageChip stage={metric.stage} label={metric.chipLabel} size="sm" />
      </div>
      <p className={styles.kpiLabel}>{metric.label}</p>
      <p className={styles.value}>{metric.value}</p>
      <p className={styles.change}>
        <TrendIcon size={14} />
        {metric.change}
      </p>
    </Card>
  );
}
