import { memo } from 'react';
import { BarChart3, Save, Globe, Search, X, TrendingUp, LayoutGrid } from 'lucide-react';
import { Button } from '../ui/Button';
import styles from './FunnelActionBar.module.css';

type ViewMode = 'flow' | 'editor' | 'analytics' | 'templates';

interface FunnelMetrics {
  totalVisitors: number;
  totalConversions: number;
  overallConversion: number;
  totalSteps: number;
}

interface FunnelActionBarProps {
  viewMode: ViewMode;
  showAnalytics: boolean;
  searchQuery: string;
  metrics: FunnelMetrics;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleAnalytics: () => void;
  onSearchChange: (query: string) => void;
  onSave: () => void;
  onPublish: () => void;
}

function FunnelActionBarComponent({
  viewMode,
  showAnalytics,
  searchQuery,
  metrics,
  onViewModeChange,
  onToggleAnalytics,
  onSearchChange,
  onSave,
  onPublish
}: FunnelActionBarProps) {
  return (
    <div className={styles.actionBar}>
      <div className={styles.leftSection}>
        <div className={styles.viewModeToggle}>
          <Button
            variant={viewMode === 'flow' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('flow')}
            className={styles.modeButton}
          >
            <BarChart3 size={16} />
            Flow
          </Button>
          <Button
            variant={viewMode === 'templates' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('templates')}
            className={styles.modeButton}
          >
            <LayoutGrid size={16} />
            Templates
          </Button>
        </div>
      </div>

      <div className={styles.centerSection}>
        <div className={styles.metricsDisplay}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Visitors</span>
            <span className={styles.metricValue}>{metrics.totalVisitors.toLocaleString()}</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Conversions</span>
            <span className={styles.metricValue}>{metrics.totalConversions.toLocaleString()}</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Rate</span>
            <span className={styles.metricValue}>{metrics.overallConversion.toFixed(1)}%</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Steps</span>
            <span className={styles.metricValue}>{metrics.totalSteps}</span>
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search steps..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className={styles.clearSearch}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className={styles.actionButtons}>
          <Button
            variant={showAnalytics ? 'primary' : 'ghost'}
            size="sm"
            onClick={onToggleAnalytics}
            title="Toggle Analytics"
          >
            <TrendingUp size={16} />
            Analytics
          </Button>
          <Button variant="secondary" size="sm" onClick={onSave}>
            <Save size={16} />
            Save
          </Button>
          <Button variant="primary" size="sm" onClick={onPublish}>
            <Globe size={16} />
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}

export const FunnelActionBar = memo(FunnelActionBarComponent);
