import type { ReactNode } from 'react';
import { useModuleMeta } from '../../hooks/useModuleMeta';

interface ModulePageHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function ModulePageHeader({ title, subtitle, actions }: ModulePageHeaderProps) {
  const module = useModuleMeta();
  const displaySubtitle = subtitle ?? module.subtitle;

  return (
    <header className="ml-page-header">
      <div>
        <h2 className="ml-page-title">{title ?? module.title}</h2>
        {displaySubtitle && !displaySubtitle.startsWith('Module placeholder') ? (
          <p className="ml-page-subtitle">{displaySubtitle}</p>
        ) : (
          <p className="ml-page-subtitle">
            Manage workflows, records, and reporting for {module.label.toLowerCase()}.
          </p>
        )}
      </div>
      {actions ? <div className="ml-header-actions">{actions}</div> : null}
    </header>
  );
}
