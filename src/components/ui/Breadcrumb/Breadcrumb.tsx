import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import styles from './Breadcrumb.module.css';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol className={styles.list}>
        <li>
          <Link to="/" className={styles.link} aria-label="Home">
            <Home size={14} />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className={styles.item}>
            <ChevronRight size={14} className={styles.separator} aria-hidden />
            {item.path && index < items.length - 1 ? (
              <Link to={item.path} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span className={styles.current} aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
