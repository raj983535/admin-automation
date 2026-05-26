import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'bordered';
}

export function Card({
  children,
  padding = 'md',
  variant = 'default',
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={[
        styles.card,
        styles[`padding-${padding}`],
        styles[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

export function CardBody({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${styles.body} ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${styles.footer} ${className}`}>{children}</div>;
}
