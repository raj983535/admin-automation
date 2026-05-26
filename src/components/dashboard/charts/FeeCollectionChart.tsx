import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { feeCollectionTrend } from '../../../data/mock/dashboard';
import { chartColors } from '../chartTheme';
import styles from './Charts.module.css';

export function FeeCollectionChart() {
  return (
    <div className={styles.chartWrap}>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={feeCollectionTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="18%">
          <CartesianGrid stroke={chartColors.grid} strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: chartColors.axis, fontSize: 12 }}
            axisLine={{ stroke: chartColors.grid }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: chartColors.axis, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v}L`}
          />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`₹${v}L`, '']} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Bar
            dataKey="collected"
            name="Collected"
            fill={chartColors.collected}
            radius={[6, 6, 0, 0]}
            barSize={28}
          />
          <Bar
            dataKey="target"
            name="Target"
            fill={chartColors.target}
            radius={[6, 6, 0, 0]}
            barSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const tooltipStyle = {
  background: chartColors.tooltipBg,
  border: `1px solid ${chartColors.tooltipBorder}`,
  borderRadius: 8,
  fontSize: 13,
};
