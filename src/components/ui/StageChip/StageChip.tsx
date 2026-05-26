import type { WorkflowStage } from '../../../theme';
import styles from './StageChip.module.css';

interface StageChipProps {
  stage: WorkflowStage;
  label?: string;
  size?: 'sm' | 'md';
}

export function StageChip({ stage, label, size = 'md' }: StageChipProps) {
  return (
    <span
      className={[styles.chip, styles[`stage-${stage}`], styles[size]]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </span>
  );
}
