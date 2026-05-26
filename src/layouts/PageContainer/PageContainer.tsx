import type { ReactNode } from 'react';
import { Breadcrumb, type BreadcrumbItem } from '../../components/ui/Breadcrumb';
import styles from './PageContainer.module.css';

interface PageContainerProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  maxWidth?: 'default' | 'wide' | 'full';
}

export function PageContainer({
  children,
  breadcrumbs,
  maxWidth = 'default',
}: PageContainerProps) {
  return (
    <main className={styles.main}>
      <div className={`${styles.container} ${styles[maxWidth]}`}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb items={breadcrumbs} />
        )}
        {children}
      </div>
    </main>
  );
}
