export type WorkflowStage =
  | 'blue'
  | 'purple'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'gray';

export const workflowStages: WorkflowStage[] = [
  'blue',
  'purple',
  'orange',
  'yellow',
  'green',
  'gray',
];

export const workflowStageLabels: Record<WorkflowStage, string> = {
  blue: 'Inquiry',
  purple: 'Review',
  orange: 'Pending',
  yellow: 'In Progress',
  green: 'Completed',
  gray: 'Archived',
};

export const spacing = {
  1: 'var(--space-1)',
  2: 'var(--space-2)',
  3: 'var(--space-3)',
  4: 'var(--space-4)',
  5: 'var(--space-5)',
  6: 'var(--space-6)',
  8: 'var(--space-8)',
  10: 'var(--space-10)',
  12: 'var(--space-12)',
} as const;
