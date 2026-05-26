import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { conversionFunnel } from '../../../data/mock/dashboard';
import { chartColors } from '../chartTheme';
import styles from './Charts.module.css';

export function ConversionChart() {
  return (
    <div className={styles.chartWrap}>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={conversionFunnel}
          layout="vertical"
          margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
        >
          <CartesianGrid stroke={chartColors.grid} strokeDasharray="4 4" horizontal={false} />
          <XAxis type="number" tick={{ fill: chartColors.axis, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="stage"
            width={72}
            tick={{ fill: chartColors.axis, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="count" name="Count" radius={[0, 6, 6, 0]} barSize={20}>
            {conversionFunnel.map((entry) => (
              <Cell key={entry.stage} fill={entry.fill} />
            ))}
          </Bar>
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
