import type { ReactNode } from 'react';
import styles from './Table.module.css';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={`${styles.table} ${className}`}>{children}</table>
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return <thead className={styles.thead}>{children}</thead>;
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className={styles.tbody}>{children}</tbody>;
}

export function TableRow({
  children,
  onClick,
  selected,
}: {
  children: ReactNode;
  onClick?: () => void;
  selected?: boolean;
}) {
  return (
    <tr
      className={[
        styles.row,
        onClick ? styles.clickable : '',
        selected ? styles.selected : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function TableHeaderCell({
  children,
  align = 'left',
}: {
  children: ReactNode;
  align?: 'left' | 'center' | 'right';
}) {
  return (
    <th className={styles.th} style={{ textAlign: align }}>
      {children}
    </th>
  );
}

export function TableCell({
  children,
  align = 'left',
}: {
  children: ReactNode;
  align?: 'left' | 'center' | 'right';
}) {
  return (
    <td className={styles.td} style={{ textAlign: align }}>
      {children}
    </td>
  );
}
