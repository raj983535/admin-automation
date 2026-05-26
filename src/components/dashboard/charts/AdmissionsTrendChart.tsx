import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { admissionsTrend } from '../../../data/mock/dashboard';
import { chartColors } from '../chartTheme';
import styles from './Charts.module.css';

export function AdmissionsTrendChart() {
  return (
    <div className={styles.chartWrap}>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={admissionsTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="inquiriesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColors.inquiries} stopOpacity={0.25} />
              <stop offset="100%" stopColor={chartColors.inquiries} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColors.leads} stopOpacity={0.2} />
              <stop offset="100%" stopColor={chartColors.leads} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={chartColors.grid} strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: chartColors.axis, fontSize: 12 }}
            axisLine={{ stroke: chartColors.grid }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: chartColors.axis, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
          <Area
            type="monotone"
            dataKey="inquiries"
            name="Inquiries"
            stroke={chartColors.inquiries}
            fill="url(#inquiriesGrad)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="leads"
            name="Leads"
            stroke={chartColors.leads}
            fill="url(#leadsGrad)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const tooltipStyle = {
  background: chartColors.tooltipBg,
  border: `1px solid ${chartColors.tooltipBorder}`,
  borderRadius: 8,
  fontSize: 13,
  boxShadow: '0 4px 16px rgba(74, 64, 56, 0.08)',
};
