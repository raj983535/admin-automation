import type { ReactNode, ButtonHTMLAttributes } from 'react';
import styles from './MetricTile.module.css';

interface MetricTileProps {
  label: string;
  value: ReactNode;
  hint?: string;
  className?: string;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
}

export function MetricTile({ label, value, hint, onClick, className = '' }: MetricTileProps) {
  if (onClick) {
    return (
      <button
        type="button"
        className={`${styles.tile} ${styles.clickable} ${className}`}
        onClick={onClick}
      >
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
        {hint ? <span className={styles.hint}>{hint}</span> : null}
      </button>
    );
  }

  return (
    <div className={`${styles.tile} ${styles.static} ${className}`}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      {hint ? <span className={styles.hint}>{hint}</span> : null}
    </div>
  );
}
